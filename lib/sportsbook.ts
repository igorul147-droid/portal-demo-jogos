export type MarketOption = {
  id: string;
  label: string;
  odd: number;
  group: string;
};

export type SportsEvent = {
  id: string;
  league: string;
  sport: string;
  kickoff: string;
  home: string;
  away: string;
  live: boolean;
  liveMinute?: number;
  scoreHome?: number;
  scoreAway?: number;
  markets: MarketOption[];
};

export type Selection = {
  eventId: string;
  eventLabel: string;
  marketId: string;
  marketLabel: string;
  odd: number;
  group: string;
  sport: string;
  league: string;
  live: boolean;
};

export type ActiveTicket = {
  id: string;
  createdAt: string;
  stake: number;
  combinedOdd: number;
  potentialReturn: number;
  selections: Selection[];
  kind: "Simples" | "Múltipla";
};

export type SettledTicket = ActiveTicket & {
  settledAt: string;
  outcome: "green" | "red" | "cashout";
  payout: number;
};

export type QuickCoupon = {
  id: string;
  label: string;
  description: string;
  selectionRefs: Array<{
    eventId: string;
    marketId: string;
  }>;
};

export const STAKE_OPTIONS = [10, 25, 50, 100, 250];

export const STORAGE_KEYS = {
  active: "demo-sports-active-tickets",
  settled: "demo-sports-settled-tickets",
  favorites: "demo-sports-favorite-events",
} as const;

export const initialSportsEvents: SportsEvent[] = [
  {
    id: "fb-001",
    sport: "Futebol",
    league: "Brasileirão Série A",
    kickoff: "Hoje • 19:30",
    home: "Flamengo",
    away: "Palmeiras",
    live: true,
    liveMinute: 64,
    scoreHome: 1,
    scoreAway: 1,
    markets: [
      { id: "home", label: "Flamengo vence", odd: 2.04, group: "Resultado Final" },
      { id: "draw", label: "Empate", odd: 3.22, group: "Resultado Final" },
      { id: "away", label: "Palmeiras vence", odd: 3.48, group: "Resultado Final" },
      { id: "goals-over", label: "Mais de 2.5 gols", odd: 1.92, group: "Gols" },
      { id: "goals-under", label: "Menos de 2.5 gols", odd: 1.78, group: "Gols" },
      { id: "btts", label: "Ambos marcam", odd: 1.59, group: "Ambos Marcam" },
      { id: "flamengo-dnb", label: "Flamengo empate anula", odd: 1.52, group: "Handicap" },
      { id: "palmeiras-dnb", label: "Palmeiras empate anula", odd: 2.26, group: "Handicap" },
    ],
  },
  {
    id: "fb-002",
    sport: "Futebol",
    league: "Champions Night",
    kickoff: "Hoje • 21:45",
    home: "Manchester City",
    away: "Real Madrid",
    live: false,
    markets: [
      { id: "home", label: "City vence", odd: 2.18, group: "Resultado Final" },
      { id: "draw", label: "Empate", odd: 3.55, group: "Resultado Final" },
      { id: "away", label: "Real vence", odd: 2.94, group: "Resultado Final" },
      { id: "btts", label: "Ambos marcam", odd: 1.66, group: "Ambos Marcam" },
      { id: "over", label: "Mais de 3.5 gols", odd: 2.42, group: "Gols" },
      { id: "under", label: "Menos de 3.5 gols", odd: 1.52, group: "Gols" },
      { id: "city-corners", label: "City mais escanteios", odd: 1.73, group: "Especiais" },
      { id: "real-corners", label: "Real mais escanteios", odd: 2.14, group: "Especiais" },
    ],
  },
  {
    id: "fb-003",
    sport: "Futebol",
    league: "Libertadores",
    kickoff: "Amanhã • 20:00",
    home: "River Plate",
    away: "Boca Juniors",
    live: false,
    markets: [
      { id: "home", label: "River vence", odd: 1.97, group: "Resultado Final" },
      { id: "draw", label: "Empate", odd: 3.14, group: "Resultado Final" },
      { id: "away", label: "Boca vence", odd: 4.12, group: "Resultado Final" },
      { id: "cards-over", label: "Mais de 5.5 cartões", odd: 1.88, group: "Especiais" },
      { id: "cards-under", label: "Menos de 5.5 cartões", odd: 1.84, group: "Especiais" },
      { id: "goals-under", label: "Menos de 2.5 gols", odd: 1.62, group: "Gols" },
    ],
  },
  {
    id: "bs-001",
    sport: "Basquete",
    league: "NBA",
    kickoff: "Hoje • 23:00",
    home: "Lakers",
    away: "Celtics",
    live: true,
    liveMinute: 39,
    scoreHome: 88,
    scoreAway: 91,
    markets: [
      { id: "home", label: "Lakers ML", odd: 1.88, group: "Vencedor" },
      { id: "away", label: "Celtics ML", odd: 1.95, group: "Vencedor" },
      { id: "over", label: "Mais de 224.5 pts", odd: 1.91, group: "Totais" },
      { id: "under", label: "Menos de 224.5 pts", odd: 1.91, group: "Totais" },
      { id: "handicap-home", label: "Lakers +4.5", odd: 1.84, group: "Handicap" },
      { id: "handicap-away", label: "Celtics -4.5", odd: 1.98, group: "Handicap" },
      { id: "player-points", label: "LeBron +28.5 pts", odd: 1.86, group: "Jogador" },
      { id: "player-assists", label: "Tatum +6.5 ast", odd: 2.12, group: "Jogador" },
    ],
  },
  {
    id: "tt-001",
    sport: "Tênis",
    league: "Masters 1000",
    kickoff: "Amanhã • 14:10",
    home: "Alcaraz",
    away: "Sinner",
    live: false,
    markets: [
      { id: "home", label: "Alcaraz vence", odd: 1.84, group: "Vencedor" },
      { id: "away", label: "Sinner vence", odd: 1.97, group: "Vencedor" },
      { id: "sets-over", label: "Mais de 2.5 sets", odd: 2.4, group: "Sets" },
      { id: "sets-under", label: "Menos de 2.5 sets", odd: 1.51, group: "Sets" },
      { id: "games-over", label: "Mais de 22.5 games", odd: 1.86, group: "Games" },
      { id: "games-under", label: "Menos de 22.5 games", odd: 1.94, group: "Games" },
      { id: "tiebreak", label: "Haverá tie-break", odd: 2.22, group: "Especiais" },
    ],
  },
];

export const quickCoupons: QuickCoupon[] = [
  {
    id: "cupom-001",
    label: "Combo futebol noite",
    description: "1X2 e gols em dois jogos de apelo alto.",
    selectionRefs: [
      { eventId: "fb-001", marketId: "home" },
      { eventId: "fb-002", marketId: "btts" },
    ],
  },
  {
    id: "cupom-002",
    label: "Cupom live rápido",
    description: "Mercados ativos para uma múltipla curta.",
    selectionRefs: [
      { eventId: "fb-001", marketId: "goals-over" },
      { eventId: "bs-001", marketId: "over" },
    ],
  },
  {
    id: "cupom-003",
    label: "Técnico conservador",
    description: "Linhas com proteção e leitura de mercado.",
    selectionRefs: [
      { eventId: "fb-001", marketId: "flamengo-dnb" },
      { eventId: "tt-001", marketId: "games-over" },
    ],
  },
];

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function buildSelection(event: SportsEvent, market: MarketOption): Selection {
  return {
    eventId: event.id,
    eventLabel: `${event.home} x ${event.away}`,
    marketId: market.id,
    marketLabel: market.label,
    odd: market.odd,
    group: market.group,
    sport: event.sport,
    league: event.league,
    live: event.live,
  };
}

export function formatLiveClock(event: SportsEvent) {
  if (!event.live || event.liveMinute === undefined) return event.kickoff;
  if (event.sport === "Basquete") return `Q4 • ${event.liveMinute}:00`;
  if (event.sport === "Tênis") return `Set 2 • ${event.liveMinute}`;
  return `${event.liveMinute}'`;
}

export function groupedMarkets(event: SportsEvent, marketFilter: string) {
  return event.markets.reduce<Record<string, MarketOption[]>>((accumulator, market) => {
    if (marketFilter !== "Todos" && market.group !== marketFilter) {
      return accumulator;
    }
    if (!accumulator[market.group]) {
      accumulator[market.group] = [];
    }
    accumulator[market.group].push(market);
    return accumulator;
  }, {});
}

export function sportGlyph(sport: string) {
  if (sport === "Futebol") return "FB";
  if (sport === "Basquete") return "BK";
  if (sport === "Tênis") return "TN";
  return "SP";
}

export function findEventById(eventId: string) {
  return initialSportsEvents.find((event) => event.id === eventId);
}