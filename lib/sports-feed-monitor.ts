type FeedSource = "engine" | "provider" | "cache";
type FeedHealth = "ok" | "degraded";
type FeedMode = "mock" | "official";

export type AuthAuditAction = "login-success" | "login-failed" | "logout" | "session-refresh";

export type AuthAuditEntry = {
  action: AuthAuditAction;
  timestamp: number;
  ip?: string;
  userAgent?: string;
};

export type FeedAuditEntry = {
  sequence: number;
  signature: string;
  source: FeedSource;
  health: FeedHealth;
  latencyMs: number;
  ticks: number;
  incidents: number;
  provider: string;
  mode: FeedMode;
  timestamp: number;
};

export type FeedSlaMetrics = {
  uptimePercent: number;
  p95LatencyMs: number;
  errorRate1m: number;
  degradedStreakSec: number;
  samples24h: number;
};

type Sample = {
  timestamp: number;
  ok: boolean;
  latencyMs: number;
};

const MAX_AUDIT_ENTRIES = 600;
const SLA_WINDOW_24H_MS = 24 * 60 * 60 * 1000;
const SLA_WINDOW_1M_MS = 60 * 1000;

const auditTrail: FeedAuditEntry[] = [];
const authTrail: AuthAuditEntry[] = [];
const samples: Sample[] = [];
let degradedStreakSec = 0;

function retentionMs() {
  const days = Number(process.env.SPORTS_AUDIT_RETENTION_DAYS || "30");
  const safeDays = Number.isFinite(days) ? Math.max(1, Math.min(days, 365)) : 30;
  return safeDays * 24 * 60 * 60 * 1000;
}

function pruneByRetention(now: number) {
  const minTimestamp = now - retentionMs();

  while (auditTrail.length > 0 && auditTrail[auditTrail.length - 1].timestamp < minTimestamp) {
    auditTrail.pop();
  }

  while (authTrail.length > 0 && authTrail[authTrail.length - 1].timestamp < minTimestamp) {
    authTrail.pop();
  }

  while (samples.length > 0 && samples[0].timestamp < Math.max(now - SLA_WINDOW_24H_MS, minTimestamp)) {
    samples.shift();
  }
}

function anonymizeIp(ip?: string) {
  if (!ip) return undefined;

  const candidate = ip.split(",")[0]?.trim();
  if (!candidate) return undefined;

  if (candidate.includes(".")) {
    const parts = candidate.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.x.x`;
    }
  }

  if (candidate.includes(":")) {
    const parts = candidate.split(":");
    return `${parts.slice(0, 3).join(":")}:x:x:x:x`;
  }

  return "masked";
}

function p95(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor(0.95 * (sorted.length - 1)));
  return sorted[idx];
}

function computeMetrics(now: number): FeedSlaMetrics {
  const from24h = now - SLA_WINDOW_24H_MS;
  const from1m = now - SLA_WINDOW_1M_MS;

  const samples24h = samples.filter((sample) => sample.timestamp >= from24h);
  const samples1m = samples.filter((sample) => sample.timestamp >= from1m);

  const ok24h = samples24h.filter((sample) => sample.ok).length;
  const uptimePercent = samples24h.length === 0 ? 100 : Number(((ok24h / samples24h.length) * 100).toFixed(2));

  const okLatencies24h = samples24h.filter((sample) => sample.ok).map((sample) => sample.latencyMs);
  const p95LatencyMs = p95(okLatencies24h);

  const errors1m = samples1m.filter((sample) => !sample.ok).length;
  const errorRate1m = samples1m.length === 0 ? 0 : Number(((errors1m / samples1m.length) * 100).toFixed(2));

  return {
    uptimePercent,
    p95LatencyMs,
    errorRate1m,
    degradedStreakSec,
    samples24h: samples24h.length,
  };
}

export function observeFeed(entry: Omit<FeedAuditEntry, "timestamp">): FeedSlaMetrics {
  const now = Date.now();
  const ok = entry.health === "ok";

  pruneByRetention(now);

  samples.push({
    timestamp: now,
    ok,
    latencyMs: entry.latencyMs,
  });

  while (samples.length > 0 && samples[0].timestamp < now - SLA_WINDOW_24H_MS) {
    samples.shift();
  }

  if (entry.health === "degraded") {
    degradedStreakSec += 1;
  } else {
    degradedStreakSec = 0;
  }

  auditTrail.unshift({
    ...entry,
    timestamp: now,
  });

  if (auditTrail.length > MAX_AUDIT_ENTRIES) {
    auditTrail.length = MAX_AUDIT_ENTRIES;
  }

  return computeMetrics(now);
}

export function getFeedAudit(limit = 120, offset = 0, cursorTs?: number, authCursorTs?: number) {
  const now = Date.now();
  pruneByRetention(now);

  const safeLimit = Math.max(1, Math.min(limit, 500));
  const safeOffset = Math.max(0, offset);

  const hasCursor = Number.isFinite(cursorTs) && Number(cursorTs) > 0;
  const hasAuthCursor = Number.isFinite(authCursorTs) && Number(authCursorTs) > 0;

  const feedSource = hasCursor ? auditTrail.filter((entry) => entry.timestamp < Number(cursorTs)) : auditTrail;
  const authSource = hasAuthCursor ? authTrail.filter((entry) => entry.timestamp < Number(authCursorTs)) : authTrail;

  const pagedEntries = feedSource.slice(safeOffset, safeOffset + safeLimit);
  const pagedAuthEntries = authSource.slice(safeOffset, safeOffset + safeLimit);

  const nextEntryCursorTs = pagedEntries.length > 0 ? pagedEntries[pagedEntries.length - 1].timestamp : null;
  const nextAuthCursorTs = pagedAuthEntries.length > 0 ? pagedAuthEntries[pagedAuthEntries.length - 1].timestamp : null;

  return {
    entries: pagedEntries,
    authEntries: pagedAuthEntries,
    totalEntries: feedSource.length,
    totalAuthEntries: authSource.length,
    offset: safeOffset,
    limit: safeLimit,
    nextEntryCursorTs,
    nextAuthCursorTs,
    metrics: computeMetrics(now),
  };
}

export function observeAuth(action: AuthAuditAction, input?: { ip?: string; userAgent?: string }) {
  const now = Date.now();
  pruneByRetention(now);

  const storeRawIp = process.env.SPORTS_AUDIT_STORE_RAW_IP === "true";

  authTrail.unshift({
    action,
    timestamp: now,
    ip: storeRawIp ? input?.ip : anonymizeIp(input?.ip),
    userAgent: input?.userAgent,
  });

  if (authTrail.length > MAX_AUDIT_ENTRIES) {
    authTrail.length = MAX_AUDIT_ENTRIES;
  }
}
