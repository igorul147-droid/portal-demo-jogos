import { clamp, initialSportsEvents, type SportsEvent } from "@/lib/sportsbook";

type FeedMode = "mock" | "official";

export type OddMover = {
  eventId: string;
  eventLabel: string;
  marketLabel: string;
  oldOdd: number;
  newOdd: number;
  delta: number;
};

export type SportsFeedSnapshot = {
  events: SportsEvent[];
  liveClockByEvent: Record<string, number>;
  suspendedMarkets: Record<string, boolean>;
  oddMovers: OddMover[];
  status: {
    mode: FeedMode;
    provider: string;
    latencyMs: number;
    lastSyncAt: number;
    ticks: number;
    incidents: number;
    health: "ok" | "degraded";
    source: "engine" | "provider" | "cache";
    signature: string;
    sequence: number;
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
};

type FeedState = {
  events: SportsEvent[];
  liveClockByEvent: Record<string, number>;
  suspendedMarkets: Record<string, boolean>;
  oddMovers: OddMover[];
  ticks: number;
  incidents: number;
  mode: FeedMode;
  provider: string;
};

function cloneInitialEvents() {
  return initialSportsEvents.map((event) => ({
    ...event,
    markets: event.markets.map((market) => ({ ...market })),
  }));
}

function marketKey(eventId: string, marketId: string) {
  return `${eventId}:${marketId}`;
}

function oddBoostLive(odd: number) {
  const drift = (Math.random() - 0.5) * 0.07;
  return Number(clamp(Number((odd + drift).toFixed(2)), 1.2, 8.8).toFixed(2));
}

const initialMode: FeedMode = process.env.NEXT_PUBLIC_SPORTS_FEED_MODE === "official" ? "official" : "mock";
const initialProvider = process.env.NEXT_PUBLIC_SPORTS_PROVIDER_NAME || (initialMode === "official" ? "Official Partner" : "Mock Feed");

const state: FeedState = {
  events: cloneInitialEvents(),
  liveClockByEvent: initialSportsEvents.reduce<Record<string, number>>((acc, event) => {
    if (event.live) {
      acc[event.id] = (event.liveMinute ?? 0) * 60;
    }
    return acc;
  }, {}),
  suspendedMarkets: {},
  oddMovers: [],
  ticks: 0,
  incidents: 0,
  mode: initialMode,
  provider: initialProvider,
};

export function nextSportsFeedSnapshot(): SportsFeedSnapshot {
  let newIncidents = 0;

  state.events = state.events.map((event) => {
    if (!event.live) return event;

    state.liveClockByEvent[event.id] = (state.liveClockByEvent[event.id] ?? (event.liveMinute ?? 0) * 60) + 1;

    const nextMarkets = event.markets.map((market) => {
      const key = marketKey(event.id, market.id);
      const isSuspended = Boolean(state.suspendedMarkets[key]);

      if (!isSuspended && Math.random() < 0.015) {
        state.suspendedMarkets[key] = true;
        newIncidents += 1;
        return market;
      }

      if (isSuspended) {
        if (Math.random() < 0.32) {
          delete state.suspendedMarkets[key];
        }
        return market;
      }

      const nextOdd = oddBoostLive(market.odd);
      const delta = Number((nextOdd - market.odd).toFixed(2));

      if (Math.abs(delta) >= 0.05) {
        state.oddMovers = [
          {
            eventId: event.id,
            eventLabel: `${event.home} x ${event.away}`,
            marketLabel: market.label,
            oldOdd: market.odd,
            newOdd: nextOdd,
            delta,
          },
          ...state.oddMovers,
        ].slice(0, 24);
      }

      return {
        ...market,
        odd: nextOdd,
      };
    });

    return {
      ...event,
      scoreHome: Math.random() < 0.007 ? (event.scoreHome ?? 0) + 1 : event.scoreHome,
      scoreAway: Math.random() < 0.006 ? (event.scoreAway ?? 0) + 1 : event.scoreAway,
      markets: nextMarkets,
    };
  });

  state.ticks += 1;
  state.incidents += newIncidents;

  return {
    events: state.events,
    liveClockByEvent: { ...state.liveClockByEvent },
    suspendedMarkets: { ...state.suspendedMarkets },
    oddMovers: state.oddMovers,
    status: {
      mode: state.mode,
      provider: state.provider,
      latencyMs: state.mode === "official" ? 80 + Math.floor(Math.random() * 45) : 230 + Math.floor(Math.random() * 160),
      lastSyncAt: Date.now(),
      ticks: state.ticks,
      incidents: state.incidents,
      health: "ok",
      source: "engine",
      signature: "pending",
      sequence: state.ticks,
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
    },
  };
}
