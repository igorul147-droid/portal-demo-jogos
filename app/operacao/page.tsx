"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import PortalHeader from "@/components/PortalHeader";

type FeedStatus = {
  mode: "mock" | "official";
  provider: string;
  latencyMs: number;
  lastSyncAt: number;
  ticks: number;
  incidents: number;
  health: "ok" | "degraded";
  source: "engine" | "provider" | "cache";
  sequence: number;
  signature: string;
  metrics: {
    uptimePercent: number;
    p95LatencyMs: number;
    errorRate1m: number;
    degradedStreakSec: number;
    samples24h: number;
  };
  alerting: {
    degradedStreakSecThreshold: number;
    p95LatencyThresholdMs: number;
    errorRate1mThresholdPercent: number;
    triggered: boolean;
  };
};

type FeedAuditEntry = {
  sequence: number;
  signature: string;
  source: "engine" | "provider" | "cache";
  health: "ok" | "degraded";
  latencyMs: number;
  ticks: number;
  incidents: number;
  provider: string;
  mode: "mock" | "official";
  timestamp: number;
};

type FeedAuditResponse = {
  entries: FeedAuditEntry[];
  authEntries: Array<{
    action: "login-success" | "login-failed" | "logout" | "session-refresh";
    timestamp: number;
    ip?: string;
    userAgent?: string;
  }>;
  metrics: FeedStatus["metrics"];
  pagination: {
    mode: "offset" | "cursor";
    offset: number;
    limit: number;
    cursorTs: number | null;
    authCursorTs: number | null;
    nextEntryCursorTs: number | null;
    nextAuthCursorTs: number | null;
    totalEntries: number;
    totalAuthEntries: number;
    hasMoreEntries: boolean;
    hasMoreAuthEntries: boolean;
  };
  generatedAt: number;
};

type FeedResponse = {
  status: FeedStatus;
};

type ViewPreset = {
  id: "monitoramento" | "balanceado" | "investigacao";
  label: string;
  limit: number;
};

const VIEW_PRESETS: ViewPreset[] = [
  { id: "monitoramento", label: "Monitoramento", limit: 10 },
  { id: "balanceado", label: "Balanceado", limit: 20 },
  { id: "investigacao", label: "Investigacao", limit: 50 },
];

const EMPTY_STATUS: FeedStatus = {
  mode: "mock",
  provider: "-",
  latencyMs: 0,
  lastSyncAt: Date.now(),
  ticks: 0,
  incidents: 0,
  health: "degraded",
  source: "engine",
  sequence: 0,
  signature: "pending",
  metrics: {
    uptimePercent: 100,
    p95LatencyMs: 0,
    errorRate1m: 0,
    degradedStreakSec: 0,
    samples24h: 0,
  },
  alerting: {
    degradedStreakSecThreshold: 8,
    p95LatencyThresholdMs: 800,
    errorRate1mThresholdPercent: 12,
    triggered: false,
  },
};

export default function OperacaoPage() {
  const [feedStatus, setFeedStatus] = useState<FeedStatus>(EMPTY_STATUS);
  const [auditEntries, setAuditEntries] = useState<FeedAuditEntry[]>([]);
  const [authEntries, setAuthEntries] = useState<FeedAuditResponse["authEntries"]>([]);
  const [auditLimit, setAuditLimit] = useState(12);
  const [cursorReady, setCursorReady] = useState(false);
  const [feedCursorTs, setFeedCursorTs] = useState<number | null>(null);
  const [authCursorTs, setAuthCursorTs] = useState<number | null>(null);
  const [feedCursorHistory, setFeedCursorHistory] = useState<Array<number | null>>([]);
  const [authCursorHistory, setAuthCursorHistory] = useState<Array<number | null>>([]);
  const [pagination, setPagination] = useState<FeedAuditResponse["pagination"]>({
    mode: "cursor",
    offset: 0,
    limit: 12,
    cursorTs: null,
    authCursorTs: null,
    nextEntryCursorTs: null,
    nextAuthCursorTs: null,
    totalEntries: 0,
    totalAuthEntries: 0,
    hasMoreEntries: false,
    hasMoreAuthEntries: false,
  });
  const [lastAuditAt, setLastAuditAt] = useState<number>(Date.now());
  const [activePreset, setActivePreset] = useState<ViewPreset["id"]>("balanceado");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const feedCursorParam = Number(params.get("feedCursorTs") || "0");
    const authCursorParam = Number(params.get("authCursorTs") || "0");
    const pageLimitParam = Number(params.get("pageLimit") || "12");
    const presetParam = (params.get("viewPreset") || "").toLowerCase() as ViewPreset["id"];

    if (Number.isFinite(feedCursorParam) && feedCursorParam > 0) {
      setFeedCursorTs(feedCursorParam);
    }

    if (Number.isFinite(authCursorParam) && authCursorParam > 0) {
      setAuthCursorTs(authCursorParam);
    }

    if (Number.isFinite(pageLimitParam)) {
      setAuditLimit(Math.max(5, Math.min(100, pageLimitParam)));
    }

    if (VIEW_PRESETS.some((item) => item.id === presetParam)) {
      setActivePreset(presetParam);
    }

    setCursorReady(true);
  }, []);

  useEffect(() => {
    if (!cursorReady) return;

    const nextUrl = new URL(window.location.href);
    if (feedCursorTs) {
      nextUrl.searchParams.set("feedCursorTs", String(feedCursorTs));
    } else {
      nextUrl.searchParams.delete("feedCursorTs");
    }

    if (authCursorTs) {
      nextUrl.searchParams.set("authCursorTs", String(authCursorTs));
    } else {
      nextUrl.searchParams.delete("authCursorTs");
    }

    nextUrl.searchParams.set("pageLimit", String(auditLimit));
    nextUrl.searchParams.set("viewPreset", activePreset);

    window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}`);
  }, [cursorReady, feedCursorTs, authCursorTs, auditLimit, activePreset]);

  useEffect(() => {
    if (!cursorReady) return;

    let cancelled = false;

    async function pull() {
      try {
        const params = new URLSearchParams();
        params.set("limit", String(auditLimit));
        if (feedCursorTs) params.set("cursorTs", String(feedCursorTs));
        if (authCursorTs) params.set("authCursorTs", String(authCursorTs));

        const [feedRes, auditRes] = await Promise.all([
          fetch("/api/sports/feed", { cache: "no-store" }),
          fetch(`/api/sports/audit?${params.toString()}`, { cache: "no-store" }),
        ]);

        if (!feedRes.ok || !auditRes.ok) return;

        const feedPayload = (await feedRes.json()) as FeedResponse;
        const auditPayload = (await auditRes.json()) as FeedAuditResponse;
        if (cancelled) return;

        setFeedStatus(feedPayload.status);
        setAuditEntries(auditPayload.entries);
        setAuthEntries(auditPayload.authEntries);
        setPagination(auditPayload.pagination);
        setLastAuditAt(auditPayload.generatedAt);
      } catch {
        if (cancelled) return;
      }
    }

    pull();
    const interval = window.setInterval(pull, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [auditLimit, cursorReady, feedCursorTs, authCursorTs]);

  const healthTone = useMemo(() => {
    if (feedStatus.alerting.triggered) return "border-rose-300/35 bg-rose-300/15 text-rose-100";
    if (feedStatus.health === "degraded") return "border-amber-300/35 bg-amber-300/15 text-amber-100";
    return "border-emerald-300/35 bg-emerald-300/15 text-emerald-100";
  }, [feedStatus.alerting.triggered, feedStatus.health]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!cursorReady) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (target?.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }

      if (event.key === "1") {
        applyPreset("monitoramento");
      }
      if (event.key === "2") {
        applyPreset("balanceado");
      }
      if (event.key === "3") {
        applyPreset("investigacao");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cursorReady]);

  async function logoutAdminSession() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/operacao/acesso";
  }

  async function copyShareLink() {
    const url = new URL(window.location.href);
    await navigator.clipboard.writeText(url.toString());
  }

  function goNextFeedPage() {
    if (!pagination.hasMoreEntries || !pagination.nextEntryCursorTs) return;

    setFeedCursorHistory((current) => [...current, feedCursorTs]);
    setFeedCursorTs(pagination.nextEntryCursorTs);
  }

  function goPreviousFeedPage() {
    setFeedCursorHistory((current) => {
      if (current.length === 0) return current;

      const previous = current[current.length - 1];
      setFeedCursorTs(previous);
      return current.slice(0, -1);
    });
  }

  function goNextAuthPage() {
    if (!pagination.hasMoreAuthEntries || !pagination.nextAuthCursorTs) return;

    setAuthCursorHistory((current) => [...current, authCursorTs]);
    setAuthCursorTs(pagination.nextAuthCursorTs);
  }

  function goPreviousAuthPage() {
    setAuthCursorHistory((current) => {
      if (current.length === 0) return current;

      const previous = current[current.length - 1];
      setAuthCursorTs(previous);
      return current.slice(0, -1);
    });
  }

  function changePageLimit(value: number) {
    const next = Math.max(5, Math.min(100, value));
    setAuditLimit(next);
    const inferredPreset = VIEW_PRESETS.find((item) => item.limit === next);
    setActivePreset(inferredPreset ? inferredPreset.id : "balanceado");
    setFeedCursorTs(null);
    setAuthCursorTs(null);
    setFeedCursorHistory([]);
    setAuthCursorHistory([]);
  }

  function applyPreset(presetId: ViewPreset["id"]) {
    const preset = VIEW_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;

    setActivePreset(preset.id);
    setAuditLimit(preset.limit);
    setFeedCursorTs(null);
    setAuthCursorTs(null);
    setFeedCursorHistory([]);
    setAuthCursorHistory([]);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(180deg,#050d1b_0%,#020712_100%)] text-white">
      <PortalHeader />

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">NOC</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">Operação Sports Feed</h1>
            <p className="mt-3 max-w-2xl text-white/65">
              Painel operacional para acompanhar saúde, assinatura, SLA e trilha de snapshots do feed em tempo real.
            </p>
          </div>
          <span className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${healthTone}`}>
            {feedStatus.alerting.triggered ? "Alerta acionado" : feedStatus.health === "ok" ? "Estável" : "Degradado"}
          </span>
          <button
            onClick={logoutAdminSession}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/75"
          >
            Sair da sessão admin
          </button>
          <button
            onClick={copyShareLink}
            className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100"
          >
            Copiar link do estado
          </button>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/45">Status atual</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs text-white/45">Modo/Fonte</p>
                <p className="mt-2 text-lg font-black text-white">{feedStatus.mode} • {feedStatus.source}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs text-white/45">Provedor</p>
                <p className="mt-2 text-lg font-black text-cyan-100">{feedStatus.provider}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs text-white/45">Latência / P95</p>
                <p className="mt-2 text-lg font-black text-cyan-100">{feedStatus.latencyMs}ms / {feedStatus.metrics.p95LatencyMs}ms</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs text-white/45">Erro 1m / Uptime</p>
                <p className="mt-2 text-lg font-black text-amber-100">{feedStatus.metrics.errorRate1m.toFixed(2)}% / {feedStatus.metrics.uptimePercent.toFixed(2)}%</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/70">
              <p>Seq #{feedStatus.sequence} • assinatura {feedStatus.signature}</p>
              <p className="mt-1">Último sync: {new Date(feedStatus.lastSyncAt).toLocaleTimeString("pt-BR")}</p>
              <p className="mt-1">Snapshot ticks: {feedStatus.ticks} • incidentes acumulados: {feedStatus.incidents}</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/45">Thresholds ativos</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs text-white/45">Degraded streak</p>
                <p className="mt-2 text-2xl font-black text-rose-100">{feedStatus.alerting.degradedStreakSecThreshold}s</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs text-white/45">P95 limite</p>
                <p className="mt-2 text-2xl font-black text-cyan-100">{feedStatus.alerting.p95LatencyThresholdMs}ms</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs text-white/45">Erro 1m limite</p>
                <p className="mt-2 text-2xl font-black text-amber-100">{feedStatus.alerting.errorRate1mThresholdPercent}%</p>
              </div>
            </div>
          </article>
        </div>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">Trilha de auditoria</p>
              <h2 className="mt-2 text-2xl font-black text-white">Últimos snapshots</h2>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/api/sports/audit?limit=500&format=csv"
                className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100"
              >
                Exportar CSV
              </a>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
                Gerado {new Date(lastAuditAt).toLocaleTimeString("pt-BR")}
              </span>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs text-white/55">
              Feed • modo {pagination.mode} • janela {pagination.limit} • total {pagination.totalEntries}
            </p>
            <div className="flex items-center gap-2">
              <div className="mr-2 hidden items-center gap-2 md:flex">
                {VIEW_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                      activePreset === preset.id
                        ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-100"
                        : "border-white/15 bg-white/5 text-white/70"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <label className="text-[10px] uppercase tracking-[0.14em] text-white/55">Limit</label>
              <select
                value={auditLimit}
                onChange={(event) => changePageLimit(Number(event.target.value))}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80"
              >
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <button
                onClick={goPreviousFeedPage}
                disabled={feedCursorHistory.length === 0}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                onClick={goNextFeedPage}
                disabled={!pagination.hasMoreEntries}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75 disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2 md:hidden">
            {VIEW_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                  activePreset === preset.id
                    ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-100"
                    : "border-white/15 bg-white/5 text-white/70"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <p className="mb-4 text-[10px] uppercase tracking-[0.14em] text-white/45">
            Atalhos: 1 Monitoramento • 2 Balanceado • 3 Investigacao
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-3 text-left text-white/60">Seq</th>
                  <th className="p-3 text-left text-white/60">Saúde</th>
                  <th className="p-3 text-left text-white/60">Fonte</th>
                  <th className="p-3 text-right text-white/60">Latência</th>
                  <th className="p-3 text-left text-white/60">Assinatura</th>
                  <th className="p-3 text-right text-white/60">Horário</th>
                </tr>
              </thead>
              <tbody>
                {auditEntries.map((entry) => (
                  <tr key={`${entry.sequence}-${entry.signature}`} className="border-b border-white/10">
                    <td className="p-3 font-semibold text-white">#{entry.sequence}</td>
                    <td className="p-3">
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${entry.health === "ok" ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-100" : "border-rose-300/30 bg-rose-300/15 text-rose-100"}`}>
                        {entry.health}
                      </span>
                    </td>
                    <td className="p-3 text-white/75">{entry.source}</td>
                    <td className="p-3 text-right text-white/80">{entry.latencyMs}ms</td>
                    <td className="p-3 text-white/75">{entry.signature.slice(0, 12)}</td>
                    <td className="p-3 text-right text-white/60">{new Date(entry.timestamp).toLocaleTimeString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">Trilha de autenticação</p>
              <h2 className="mt-2 text-2xl font-black text-white">Login, falha e logout</h2>
            </div>
            <a
              href="/api/sports/audit?limit=500&format=auth-csv"
              className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100"
            >
              Exportar Auth CSV
            </a>
          </div>

          <div className="mb-4 text-xs text-white/55">
            Auth • exibidos: {authEntries.length} de {pagination.totalAuthEntries}
          </div>

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs text-white/55">
              Cursor auth: {pagination.authCursorTs ? pagination.authCursorTs : "início"}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={goPreviousAuthPage}
                disabled={authCursorHistory.length === 0}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                onClick={goNextAuthPage}
                disabled={!pagination.hasMoreAuthEntries}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75 disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-3 text-left text-white/60">Ação</th>
                  <th className="p-3 text-left text-white/60">IP</th>
                  <th className="p-3 text-left text-white/60">User-Agent</th>
                  <th className="p-3 text-right text-white/60">Horário</th>
                </tr>
              </thead>
              <tbody>
                {authEntries.map((entry, index) => (
                  <tr key={`${entry.action}-${entry.timestamp}-${index}`} className="border-b border-white/10">
                    <td className="p-3">
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${entry.action === "login-failed" ? "border-rose-300/30 bg-rose-300/15 text-rose-100" : "border-emerald-300/30 bg-emerald-300/15 text-emerald-100"}`}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="p-3 text-white/75">{entry.ip || "-"}</td>
                    <td className="max-w-[300px] truncate p-3 text-white/60">{entry.userAgent || "-"}</td>
                    <td className="p-3 text-right text-white/60">{new Date(entry.timestamp).toLocaleTimeString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <Footer />
    </main>
  );
}
