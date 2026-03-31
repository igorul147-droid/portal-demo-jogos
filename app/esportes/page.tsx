"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Footer from "@/components/Footer";
import PortalHeader from "@/components/PortalHeader";
import { formatBRL } from "@/lib/currency";
import {
  STAKE_OPTIONS,
  STORAGE_KEYS,
  buildSelection,
  formatLiveClock,
  initialSportsEvents,
  quickCoupons,
  sportGlyph,
  type ActiveTicket,
  type Selection,
  type SettledTicket,
  type SportsEvent,
} from "@/lib/sportsbook";
import type { SportsFeedSnapshot } from "@/lib/sports-feed-engine";

type OddMover = {
  eventId: string;
  eventLabel: string;
  marketLabel: string;
  oldOdd: number;
  newOdd: number;
  delta: number;
};

type MarketConfidence = {
  label: string;
  className: string;
};

type FeedMode = "mock" | "official";

type FeedStatus = {
  mode: FeedMode;
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

function selectionKey(selection: Selection) {
  return `${selection.eventId}:${selection.marketId}`;
}

function marketKey(eventId: string, marketId: string) {
  return `${eventId}:${marketId}`;
}

function clockLabel(event: SportsEvent, clockSeconds?: number) {
  if (!event.live) return event.kickoff;

  if (clockSeconds === undefined) {
    return formatLiveClock(event);
  }

  if (event.sport === "Basquete") {
    const mm = Math.floor(clockSeconds / 60);
    const ss = clockSeconds % 60;
    return `Q4 • ${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }

  if (event.sport === "Tênis") {
    const mm = Math.floor(clockSeconds / 60);
    const ss = clockSeconds % 60;
    return `Set 2 • ${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }

  const mm = Math.floor(clockSeconds / 60);
  const ss = clockSeconds % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function marketConfidence(odd: number): MarketConfidence {
  if (odd <= 1.65) {
    return {
      label: "Estável",
      className: "border-emerald-300/30 bg-emerald-300/15 text-emerald-100",
    };
  }

  if (odd <= 2.4) {
    return {
      label: "Moderado",
      className: "border-cyan-300/30 bg-cyan-300/15 text-cyan-100",
    };
  }

  return {
    label: "Arriscado",
    className: "border-rose-300/30 bg-rose-300/15 text-rose-100",
  };
}

export default function EsportesPage() {
  const { saldo, setSaldo, registrarResultado } = useDemoWallet();
  const initialMode: FeedMode = process.env.NEXT_PUBLIC_SPORTS_FEED_MODE === "official" ? "official" : "mock";
  const initialProvider = process.env.NEXT_PUBLIC_SPORTS_PROVIDER_NAME || (initialMode === "official" ? "Official Partner" : "Mock Feed");
  const [events, setEvents] = useState<SportsEvent[]>(initialSportsEvents);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sportFilter, setSportFilter] = useState<string>("Todos");
  const [eventStatusFilter, setEventStatusFilter] = useState<"agora" | "proximos" | "historico">("agora");
  const [query, setQuery] = useState("");
  const [selections, setSelections] = useState<Selection[]>([]);
  const [stake, setStake] = useState<number>(STAKE_OPTIONS[1]);
  const [activeTickets, setActiveTickets] = useState<ActiveTicket[]>([]);
  const [settledTickets, setSettledTickets] = useState<SettledTicket[]>([]);
  const [oddMovers, setOddMovers] = useState<OddMover[]>([]);
  const [liveClockByEvent, setLiveClockByEvent] = useState<Record<string, number>>({});
  const [suspendedMarkets, setSuspendedMarkets] = useState<Record<string, boolean>>({});
  const [feedStatus, setFeedStatus] = useState<FeedStatus>({
    mode: initialMode,
    provider: initialProvider,
    latencyMs: initialMode === "official" ? 95 : 280,
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
  });
  const failuresRef = useRef(0);

  useEffect(() => {
    const activeRaw = window.localStorage.getItem(STORAGE_KEYS.active);
    const settledRaw = window.localStorage.getItem(STORAGE_KEYS.settled);
    const favoritesRaw = window.localStorage.getItem(STORAGE_KEYS.favorites);

    if (activeRaw) setActiveTickets(JSON.parse(activeRaw));
    if (settledRaw) setSettledTickets(JSON.parse(settledRaw));
    if (favoritesRaw) setFavorites(JSON.parse(favoritesRaw));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.active, JSON.stringify(activeTickets));
  }, [activeTickets]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.settled, JSON.stringify(settledTickets));
  }, [settledTickets]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    let cancelled = false;

    async function pullFeed() {
      const startedAt = performance.now();

      try {
        const response = await fetch("/api/sports/feed", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Feed indisponivel: ${response.status}`);
        }

        const payload = (await response.json()) as SportsFeedSnapshot;
        if (cancelled) return;

        failuresRef.current = 0;
        setEvents(payload.events);
        setLiveClockByEvent(payload.liveClockByEvent);
        setSuspendedMarkets(payload.suspendedMarkets);
        setOddMovers(payload.oddMovers);
        setFeedStatus({
          ...payload.status,
          latencyMs: Math.max(payload.status.latencyMs, Math.round(performance.now() - startedAt)),
        });
      } catch {
        if (cancelled) return;

        failuresRef.current += 1;
        setFeedStatus((current) => ({
          ...current,
          health: "degraded",
          latencyMs: Math.round(performance.now() - startedAt),
          incidents: current.incidents + 1,
        }));
      }
    }

    pullFeed();
    const interval = window.setInterval(pullFeed, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  function parseEventStatus(event: SportsEvent): "agora" | "proximos" | "historico" {
    if (event.live) return "agora";
    const kickoffText = event.kickoff.toLowerCase();
    if (kickoffText.includes("hoje") || kickoffText.includes("em")) return "proximos";
    return "historico";
  }

  const sports = useMemo(() => {
    return ["Todos", ...Array.from(new Set(events.map((event) => event.sport)))];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const lowered = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSport = sportFilter === "Todos" || event.sport === sportFilter;
      if (!matchesSport) return false;

      const eventStatus = parseEventStatus(event);
      if (eventStatusFilter === "agora" && eventStatus !== "agora") return false;
      if (eventStatusFilter === "proximos" && (eventStatus === "historico")) return false;
      if (eventStatusFilter === "historico" && eventStatus !== "historico") return false;

      if (!lowered) return true;

      const searchable = `${event.home} ${event.away} ${event.league} ${event.sport}`.toLowerCase();
      return searchable.includes(lowered);
    });
  }, [events, query, sportFilter, eventStatusFilter]);

  const totalLive = useMemo(() => events.filter((event) => event.live).length, [events]);
  const totalMarkets = useMemo(
    () => filteredEvents.reduce((sum, event) => sum + event.markets.length, 0),
    [filteredEvents]
  );
  const totalSuspended = useMemo(
    () => Object.values(suspendedMarkets).filter(Boolean).length,
    [suspendedMarkets]
  );
  const favoriteEvents = useMemo(
    () => favorites.map((id) => events.find((event) => event.id === id)).filter((event): event is SportsEvent => Boolean(event)),
    [events, favorites]
  );
  const topMovers = useMemo(
    () => [...oddMovers].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 6),
    [oddMovers]
  );
  const suggestedCombos = useMemo(() => {
    return topMovers
      .slice(0, 3)
      .map((mover) => {
        const event = events.find((item) => item.id === mover.eventId);
        const market = event?.markets.find((item) => item.label === mover.marketLabel);

        if (!event || !market) return null;

        return {
          id: `${event.id}:${market.id}`,
          title: `${event.home} x ${event.away}`,
          subtitle: market.label,
          odd: market.odd,
          confidence: marketConfidence(market.odd),
          event,
          market,
        };
      })
      .filter((combo): combo is NonNullable<typeof combo> => Boolean(combo));
  }, [events, topMovers]);

  const combinedOdd = useMemo(() => {
    if (selections.length === 0) return 0;
    return Number(selections.reduce((acc, selection) => acc * selection.odd, 1).toFixed(2));
  }, [selections]);

  const potentialReturn = useMemo(() => {
    if (!combinedOdd) return 0;
    return Number((combinedOdd * stake).toFixed(2));
  }, [combinedOdd, stake]);

  const canPlaceBet = selections.length > 0 && stake > 0 && saldo >= stake;

  function toggleFavorite(eventId: string) {
    setFavorites((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [eventId, ...current].slice(0, 20)
    );
  }

  function toggleSelection(event: SportsEvent, marketId: string) {
    const market = event.markets.find((item) => item.id === marketId);
    if (!market) return;

    const next = buildSelection(event, market);
    const nextKey = selectionKey(next);

    setSelections((current) => {
      const exists = current.some((selection) => selectionKey(selection) === nextKey);
      if (exists) return current.filter((selection) => selectionKey(selection) !== nextKey);
      return [...current, next];
    });
  }

  function addCoupon(couponId: string) {
    const coupon = quickCoupons.find((item) => item.id === couponId);
    if (!coupon) return;

    setSelections((current) => {
      const byKey = new Map(current.map((selection) => [selectionKey(selection), selection]));

      for (const ref of coupon.selectionRefs) {
        const event = events.find((item) => item.id === ref.eventId);
        const market = event?.markets.find((item) => item.id === ref.marketId);
        if (!event || !market) continue;

        const next = buildSelection(event, market);
        byKey.set(selectionKey(next), next);
      }

      return Array.from(byKey.values());
    });
  }

  function addSuggestedCombo(event: SportsEvent, marketId: string) {
    toggleSelection(event, marketId);
  }

  function placeTicket() {
    if (!canPlaceBet) return;

    const ticket: ActiveTicket = {
      id: `tk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      stake,
      combinedOdd,
      potentialReturn,
      selections,
      kind: selections.length > 1 ? "Múltipla" : "Simples",
    };

    setSaldo((value) => value - stake);
    registrarResultado(stake, 0);
    setActiveTickets((current) => [ticket, ...current].slice(0, 30));
    setSelections([]);
  }

  function settleTicket(ticketId: string, outcome: "green" | "red") {
    setActiveTickets((current) => {
      const ticket = current.find((item) => item.id === ticketId);
      if (!ticket) return current;

      const payout = outcome === "green" ? ticket.potentialReturn : 0;
      if (payout > 0) {
        setSaldo((value) => value + payout);
      }
      registrarResultado(0, payout);

      const settled: SettledTicket = {
        ...ticket,
        settledAt: new Date().toISOString(),
        payout,
        outcome,
      };

      setSettledTickets((history) => [settled, ...history].slice(0, 40));
      return current.filter((item) => item.id !== ticketId);
    });
  }

  function cashoutTicket(ticketId: string) {
    setActiveTickets((current) => {
      const ticket = current.find((item) => item.id === ticketId);
      if (!ticket) return current;

      const payout = Number((ticket.stake * (0.45 + Math.random() * 0.45)).toFixed(2));
      setSaldo((value) => value + payout);
      registrarResultado(0, payout);

      const settled: SettledTicket = {
        ...ticket,
        settledAt: new Date().toISOString(),
        payout,
        outcome: "cashout",
      };

      setSettledTickets((history) => [settled, ...history].slice(0, 40));
      return current.filter((item) => item.id !== ticketId);
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_22%),linear-gradient(180deg,#06101f_0%,#020712_100%)] text-white">
      <PortalHeader />

      <section className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(8,14,28,0.9)_0%,rgba(5,9,19,0.96)_100%)]">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-10">
          {feedStatus.alerting.triggered ? (
            <div className="mb-4 rounded-2xl border border-rose-300/35 bg-rose-300/15 px-4 py-3 text-sm font-semibold text-rose-100">
              Alerta operacional: thresholds violados. Streak {feedStatus.metrics.degradedStreakSec}s, P95 {feedStatus.metrics.p95LatencyMs}ms, erro 1m {feedStatus.metrics.errorRate1m.toFixed(2)}%.
            </div>
          ) : null}

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${feedStatus.mode === "official" ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-100" : "border-amber-300/30 bg-amber-300/15 text-amber-100"}`}>
              {feedStatus.mode === "official" ? "Feed oficial" : "Feed de homologação"}
            </span>
            <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${feedStatus.health === "ok" ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100" : "border-rose-300/30 bg-rose-300/15 text-rose-100"}`}>
              {feedStatus.health === "ok" ? "Feed estável" : "Conexão degradada"}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
              Provedor: {feedStatus.provider}
            </span>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">
              Latência: {feedStatus.latencyMs}ms
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
              Fonte: {feedStatus.source}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
              Seq: #{feedStatus.sequence}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
              Assinatura: {feedStatus.signature.slice(0, 10)}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
              Último sync: {new Date(feedStatus.lastSyncAt).toLocaleTimeString("pt-BR")}
            </span>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100">
              Uptime 24h: {feedStatus.metrics.uptimePercent.toFixed(2)}%
            </span>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">
              P95: {feedStatus.metrics.p95LatencyMs}ms
            </span>
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100">
              Erro 1m: {feedStatus.metrics.errorRate1m.toFixed(2)}%
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/70">Sportsbook</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Odds em tempo real, ticket em um clique</h1>
              <p className="mt-4 max-w-3xl text-base text-white/65 sm:text-lg">
                Estrutura completa de apostas esportivas com filtros por esporte, mercados por confronto, cupons rápidos e integração direta com a wallet demo.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {sports.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSportFilter(sport)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${
                      sportFilter === sport
                        ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-100"
                        : "border-white/15 bg-white/5 text-white/65 hover:text-white"
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">Eventos no feed</p>
                <p className="mt-2 text-3xl font-black text-cyan-200">{filteredEvents.length}</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">Ao vivo</p>
                <p className="mt-2 text-3xl font-black text-rose-200">{totalLive}</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">Mercados visíveis</p>
                <p className="mt-2 text-3xl font-black text-amber-200">{totalMarkets}</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">Mercados suspensos</p>
                <p className="mt-2 text-3xl font-black text-orange-200">{totalSuspended}</p>
              </article>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.16em] text-white/45">Status:</span>
              {(["agora", "proximos", "historico"] as const).map((status) => {
                const labels: Record<typeof status, string> = {
                  agora: "🔴 Agora",
                  proximos: "📅 Próximos",
                  historico: "📊 Histórico",
                };
                return (
                  <button
                    key={status}
                    onClick={() => setEventStatusFilter(status)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${
                      eventStatusFilter === status
                        ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                        : "border-white/15 bg-white/5 text-white/65 hover:text-white"
                    }`}
                  >
                    {labels[status]}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar confronto, liga ou esporte"
                className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-300/40 focus:outline-none"
              />
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                Atualização ao vivo a cada 1s
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 xl:grid-cols-[1.08fr_0.52fr_0.4fr]">
        <div className="space-y-6">
          <section className="grid gap-4 xl:hidden sm:grid-cols-2">
            <article className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">Favoritos</p>
                <span className="text-xs text-white/55">{favoriteEvents.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {favoriteEvents.slice(0, 2).map((event) => (
                  <Link key={event.id} href={`/esportes/${event.id}`} className="block rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/80">
                    {event.home} x {event.away}
                  </Link>
                ))}
                {favoriteEvents.length === 0 ? <p className="text-xs text-white/55">Sem eventos salvos ainda.</p> : null}
              </div>
            </article>
            <article className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">Live Movers</p>
                <span className="text-xs text-white/55">{topMovers.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {topMovers.slice(0, 2).map((mover, index) => (
                  <div key={`${mover.eventId}-${index}`} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                    <p className="text-xs text-white/70">{mover.marketLabel}</p>
                    <p className={`text-sm font-bold ${mover.delta >= 0 ? "text-rose-200" : "text-emerald-200"}`}>
                      {mover.delta >= 0 ? "+" : ""}{mover.delta.toFixed(2)}
                    </p>
                  </div>
                ))}
                {topMovers.length === 0 ? <p className="text-xs text-white/55">Aguardando variações.</p> : null}
              </div>
            </article>
          </section>

          {suggestedCombos.length > 0 ? (
            <section className="rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">Sugestões automáticas</p>
                  <h2 className="mt-1 text-2xl font-black text-white">Combos com movimento</h2>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {suggestedCombos.map((combo) => (
                  <button
                    key={combo.id}
                    onClick={() => addSuggestedCombo(combo.event, combo.market.id)}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-300/30 hover:bg-cyan-300/10"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-white/45">{combo.title}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{combo.subtitle}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xl font-black text-amber-200">{combo.odd.toFixed(2)}</p>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${combo.confidence.className}`}>
                        {combo.confidence.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Cupons rápidos</p>
                <h2 className="mt-1 text-2xl font-black text-white">Entrada acelerada</h2>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {quickCoupons.map((coupon) => (
                <button
                  key={coupon.id}
                  onClick={() => addCoupon(coupon.id)}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-emerald-300/30 hover:bg-emerald-300/10"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-emerald-200/75">{coupon.label}</p>
                  <p className="mt-2 text-sm text-white/80">{coupon.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  {eventStatusFilter === "agora" && "Jogos ao vivo agora"}
                  {eventStatusFilter === "proximos" && "Próximos jogos e em andamento"}
                  {eventStatusFilter === "historico" && "Jogos já finalizado"}
                </p>
                <h2 className="mt-1 text-2xl font-black text-white">
                  {filteredEvents.length} {filteredEvents.length === 1 ? "evento" : "eventos"} encontrado{filteredEvents.length !== 1 ? "s" : ""}
                </h2>
              </div>
            </div>
          </div>

          {filteredEvents.map((event) => {
            const marketSlice = event.markets.slice(0, 6);

            return (
              <article key={event.id} className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-xs font-black text-cyan-200">
                      {sportGlyph(event.sport)}
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">{event.sport} • {event.league}</p>
                      <h3 className="mt-2 text-2xl font-black text-white">{event.home} <span className="text-white/35">vs</span> {event.away}</h3>
                      <p className="mt-2 text-sm text-white/60">{event.live ? `Ao vivo • ${clockLabel(event, liveClockByEvent[event.id])}` : event.kickoff}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(event.id)}
                      className={`rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] ${
                        favorites.includes(event.id)
                          ? "border-amber-300/35 bg-amber-300/15 text-amber-100"
                          : "border-white/15 bg-white/5 text-white/65"
                      }`}
                    >
                      {favorites.includes(event.id) ? "Favorito" : "Salvar"}
                    </button>
                    <Link
                      href={`/esportes/${event.id}`}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/75 transition hover:text-white"
                    >
                      Ver evento
                    </Link>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {marketSlice.map((market) => {
                    const isSelected = selections.some(
                      (selection) => selection.eventId === event.id && selection.marketId === market.id
                    );
                    const isSuspended = Boolean(suspendedMarkets[marketKey(event.id, market.id)]);
                    const confidence = marketConfidence(market.odd);

                    return (
                      <button
                        key={market.id}
                        disabled={isSuspended}
                        onClick={() => toggleSelection(event, market.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-emerald-300/40 bg-emerald-300/15"
                            : "border-white/10 bg-black/30 hover:border-cyan-200/30"
                        } ${isSuspended ? "cursor-not-allowed opacity-45" : ""}`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">{market.group}</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-white">{market.label}</p>
                          {isSuspended ? (
                            <span className="rounded-full border border-orange-300/30 bg-orange-300/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-100">
                              Suspenso
                            </span>
                          ) : (
                            <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${confidence.className}`}>
                              {confidence.label}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-2xl font-black text-amber-200">{market.odd.toFixed(2)}</p>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="hidden space-y-5 xl:sticky xl:top-24 xl:h-fit xl:block">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Betslip</p>
            <h2 className="mt-2 text-2xl font-black text-white">Seu ticket</h2>

            <div className="mt-4 space-y-3">
              {selections.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">
                  Selecione mercados para montar um ticket simples ou múltiplo.
                </p>
              ) : (
                selections.map((selection) => (
                  <article key={selectionKey(selection)} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/40">{selection.league}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{selection.eventLabel}</p>
                    <p className="mt-1 text-sm text-white/70">{selection.marketLabel}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xl font-black text-amber-200">{selection.odd.toFixed(2)}</p>
                      <button
                        onClick={() =>
                          setSelections((current) =>
                            current.filter((item) => selectionKey(item) !== selectionKey(selection))
                          )
                        }
                        className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/65"
                      >
                        Remover
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">Stake</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {STAKE_OPTIONS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setStake(amount)}
                    className={`rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] ${
                      stake === amount
                        ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                        : "border-white/15 bg-white/5 text-white/65"
                    }`}
                  >
                    {formatBRL(amount)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm">
              <div className="flex items-center justify-between text-white/70">
                <span>Seleções</span>
                <span>{selections.length}</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Odd combinada</span>
                <span>{combinedOdd ? combinedOdd.toFixed(2) : "-"}</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Saldo</span>
                <span>{formatBRL(saldo)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-2 text-base font-bold text-emerald-200">
                <span>Retorno potencial</span>
                <span>{formatBRL(potentialReturn)}</span>
              </div>
            </div>

            <button
              onClick={placeTicket}
              disabled={!canPlaceBet}
              className="mt-4 w-full rounded-2xl border border-emerald-300/35 bg-emerald-300/20 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-emerald-100 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Confirmar aposta
            </button>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Tickets ativos</p>
            <div className="mt-4 space-y-3">
              {activeTickets.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">Nenhuma aposta ativa no momento.</p>
              ) : (
                activeTickets.map((ticket) => (
                  <article key={ticket.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/40">{ticket.kind}</p>
                      <p className="text-xs text-white/50">{new Date(ticket.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <p className="mt-2 text-sm text-white/70">{ticket.selections.length} seleções • odd {ticket.combinedOdd.toFixed(2)}</p>
                    <p className="mt-2 text-sm text-white/70">Stake {formatBRL(ticket.stake)} • Retorno {formatBRL(ticket.potentialReturn)}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <button onClick={() => settleTicket(ticket.id, "green")} className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100">
                        Green
                      </button>
                      <button onClick={() => settleTicket(ticket.id, "red")} className="rounded-full border border-rose-300/30 bg-rose-300/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-100">
                        Red
                      </button>
                      <button onClick={() => cashoutTicket(ticket.id)} className="rounded-full border border-amber-300/30 bg-amber-300/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100">
                        Cashout
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

        </aside>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:h-fit">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Favoritos</p>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                Fixos
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {favoriteEvents.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">
                  Marque confrontos com "Salvar" para manter sua shortlist sempre visível.
                </p>
              ) : (
                favoriteEvents.slice(0, 6).map((event) => (
                  <article key={event.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/40">{event.league}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{event.home} x {event.away}</p>
                    <p className="mt-1 text-xs text-white/60">{event.live ? `Ao vivo • ${formatLiveClock(event)}` : event.kickoff}</p>
                    <Link href={`/esportes/${event.id}`} className="mt-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">
                      Abrir evento
                    </Link>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Radar de odds</p>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-200">
                Live movers
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {topMovers.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">
                  Aguardando oscilações relevantes de mercado.
                </p>
              ) : (
                topMovers.map((mover, index) => (
                  <article key={`${mover.eventId}-${mover.marketLabel}-${index}`} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/40">{mover.eventLabel}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{mover.marketLabel}</p>
                    <p className="mt-2 text-xs text-white/60">{mover.oldOdd.toFixed(2)} → {mover.newOdd.toFixed(2)}</p>
                    <p className={`mt-2 text-sm font-black ${mover.delta >= 0 ? "text-rose-200" : "text-emerald-200"}`}>
                      {mover.delta >= 0 ? "+" : ""}{mover.delta.toFixed(2)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Histórico recente</p>
            <div className="mt-4 space-y-3">
              {settledTickets.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">Sem tickets finalizados por enquanto.</p>
              ) : (
                settledTickets.slice(0, 8).map((ticket) => (
                  <article key={`${ticket.id}-${ticket.settledAt}`} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <p className="uppercase tracking-[0.16em] text-white/45">{ticket.kind}</p>
                      <p className={`${ticket.outcome === "green" ? "text-emerald-200" : ticket.outcome === "red" ? "text-rose-200" : "text-amber-200"}`}>
                        {ticket.outcome.toUpperCase()}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-white/70">{ticket.selections.length} seleções • odd {ticket.combinedOdd.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-white/70">Payout: {formatBRL(ticket.payout)}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </aside>
      </section>

      <Footer />
    </main>
  );
}