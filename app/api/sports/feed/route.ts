import { NextResponse } from "next/server";
import { createHash, createHmac } from "node:crypto";
import { nextSportsFeedSnapshot, type SportsFeedSnapshot } from "@/lib/sports-feed-engine";
import { observeFeed } from "@/lib/sports-feed-monitor";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

let sequence = 0;
let lastGoodSnapshot: SportsFeedSnapshot | null = null;
const signSecret = process.env.SPORTS_FEED_HMAC_SECRET || "";
const degradedStreakSecThreshold = Number(process.env.SPORTS_ALERT_DEGRADED_STREAK_SEC || "8");
const p95LatencyThresholdMs = Number(process.env.SPORTS_ALERT_P95_MS || "800");
const errorRate1mThresholdPercent = Number(process.env.SPORTS_ALERT_ERROR_RATE_1M_PERCENT || "12");

function signSnapshot(snapshot: SportsFeedSnapshot, seq: number) {
  const payload = {
    seq,
    events: snapshot.events,
    liveClockByEvent: snapshot.liveClockByEvent,
    suspendedMarkets: snapshot.suspendedMarkets,
    oddMovers: snapshot.oddMovers,
    ticks: snapshot.status.ticks,
    incidents: snapshot.status.incidents,
  };

  const raw = JSON.stringify(payload);
  if (signSecret) {
    return createHmac("sha256", signSecret).update(raw).digest("hex").slice(0, 20);
  }

  return createHash("sha256").update(raw).digest("hex").slice(0, 20);
}

function withMeta(snapshot: SportsFeedSnapshot, source: "engine" | "provider" | "cache", health: "ok" | "degraded", latencyMs: number) {
  sequence += 1;
  const signature = signSnapshot(snapshot, sequence);
  const metrics = observeFeed({
    sequence,
    signature,
    source,
    health,
    latencyMs,
    ticks: snapshot.status.ticks,
    incidents: snapshot.status.incidents,
    provider: snapshot.status.provider,
    mode: snapshot.status.mode,
  });
  const triggered =
    metrics.degradedStreakSec >= degradedStreakSecThreshold ||
    metrics.p95LatencyMs >= p95LatencyThresholdMs ||
    metrics.errorRate1m >= errorRate1mThresholdPercent;

  return {
    ...snapshot,
    status: {
      ...snapshot.status,
      source,
      health,
      latencyMs,
      sequence,
      signature,
      lastSyncAt: Date.now(),
      metrics,
      alerting: {
        degradedStreakSecThreshold,
        p95LatencyThresholdMs,
        errorRate1mThresholdPercent,
        triggered,
      },
    },
  } satisfies SportsFeedSnapshot;
}

async function tryProviderSnapshot(timeoutMs: number): Promise<SportsFeedSnapshot | null> {
  const providerUrl = process.env.SPORTS_PROVIDER_URL;
  if (!providerUrl) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(providerUrl, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as Partial<SportsFeedSnapshot>;

    if (!payload.events || !payload.liveClockByEvent || !payload.suspendedMarkets || !payload.oddMovers || !payload.status) {
      return null;
    }

    return payload as SportsFeedSnapshot;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const startedAt = performance.now();
  const mode = process.env.NEXT_PUBLIC_SPORTS_FEED_MODE === "official" ? "official" : "mock";

  if (mode === "official") {
    const providerSnapshot = await tryProviderSnapshot(700);
    const latency = Math.round(performance.now() - startedAt);

    if (providerSnapshot) {
      const stable = withMeta(providerSnapshot, "provider", "ok", latency);
      lastGoodSnapshot = stable;

      return NextResponse.json(stable, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    if (lastGoodSnapshot) {
      const cached = withMeta(lastGoodSnapshot, "cache", "degraded", latency);
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }
  }

  const engineSnapshot = nextSportsFeedSnapshot();
  const latency = Math.round(performance.now() - startedAt);
  const stable = withMeta(engineSnapshot, "engine", "ok", latency);
  lastGoodSnapshot = stable;

  return NextResponse.json(stable, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
