"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";

type CatalogGame = {
  nome: string;
  provider: "PG" | "PP" | "POPOK" | "G759" | "Tada";
  rota?: string;
  capa: string;
  subtitle: string;
  badge?: string;
  accentClass: string;
  glowClass: string;
};

const providers: CatalogGame["provider"][] = ["PG", "PP", "POPOK", "G759", "Tada"];

const jogos: CatalogGame[] = [
  // PG Soft
  { nome: "Fortune Tiger", provider: "PG", rota: "/jogos/fortune-tiger", capa: "🐯", subtitle: "Lucky tiger reels", badge: "Hot", accentClass: "from-amber-300/25 via-red-500/20 to-red-950", glowClass: "shadow-[0_0_32px_rgba(245,158,11,0.22)]" },
  { nome: "Mahjong Ways", provider: "PG", rota: "/jogos/mahjong-ways", capa: "🎋", subtitle: "Oriental cluster slot", badge: "Premium", accentClass: "from-sky-300/20 via-emerald-400/15 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(56,189,248,0.18)]" },
  { nome: "Fortune Rabbit", provider: "PG", rota: "/jogos/fortune-rabbit", capa: "🐇", subtitle: "Rabbit fireworks", badge: "Hot", accentClass: "from-sky-300/20 via-fuchsia-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(96,165,250,0.18)]" },
  { nome: "Fortune Dragon", provider: "PG", rota: "/jogos/fortune-dragon", capa: "🐲", subtitle: "Dragon multiplier", badge: "Boost", accentClass: "from-pink-300/20 via-violet-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(217,70,239,0.2)]" },
  { nome: "Fortune Ox", provider: "PG", rota: "/jogos/fortune-ox", capa: "🐂", subtitle: "Ox prosperity spins", badge: "New", accentClass: "from-amber-300/20 via-red-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(251,146,60,0.2)]" },
  { nome: "Fortune Mouse", provider: "PG", rota: "/jogos/fortune-mouse", capa: "🐭", subtitle: "Treasure sprint", accentClass: "from-rose-300/20 via-pink-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(244,114,182,0.18)]" },
  { nome: "Wild Bandito", provider: "PG", rota: "/jogos/wild-bandito", capa: "🎸", subtitle: "Outlaw reels", badge: "Premium", accentClass: "from-orange-300/20 via-amber-500/15 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(251,146,60,0.18)]" },
  { nome: "Piggy Gold", provider: "PG", rota: "/jogos/piggy-gold", capa: "🐷", subtitle: "Golden vault spin", badge: "Premium", accentClass: "from-pink-300/20 via-rose-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(244,114,182,0.18)]" },
  { nome: "Candy Burst", provider: "PG", rota: "/jogos/candy-burst", capa: "🍬", subtitle: "Sugar pop reels", badge: "Premium", accentClass: "from-fuchsia-300/20 via-pink-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(232,121,249,0.18)]" },
  { nome: "Ganesha Gold", provider: "PG", rota: "/jogos/ganesha-gold", capa: "🐘", subtitle: "Golden elephant bonus", badge: "Premium", accentClass: "from-yellow-300/20 via-amber-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(250,204,21,0.18)]" },
  { nome: "Leprechaun Riches", provider: "PG", rota: "/jogos/leprechaun-riches", capa: "☘️", subtitle: "Clover jackpot", badge: "Premium", accentClass: "from-emerald-300/20 via-lime-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(74,222,128,0.18)]" },
  { nome: "Gem Saviour", provider: "PG", rota: "/jogos/gem-saviour", capa: "💎", subtitle: "Crystal rescue", badge: "Premium", accentClass: "from-cyan-300/20 via-sky-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(34,211,238,0.18)]" },
  { nome: "Tree of Fortune", provider: "PG", rota: "/jogos/tree-of-fortune", capa: "🌳", subtitle: "Prosperity spins", badge: "Premium", accentClass: "from-emerald-300/20 via-green-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(34,197,94,0.18)]" },
  { nome: "Fortuna Neon", provider: "PG", rota: "/jogos/fortuna-neon", capa: "⚡", subtitle: "Neon vault lines", badge: "Live", accentClass: "from-fuchsia-300/20 via-cyan-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(34,211,238,0.18)]" },
  // Pragmatic Play
  { nome: "Sweet Bonanza", provider: "PP", rota: "/jogos/sweet-bonanza", capa: "🍭", subtitle: "Candy tumble", badge: "Top", accentClass: "from-pink-300/20 via-violet-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(236,72,153,0.2)]" },
  { nome: "Gates of Olympus", provider: "PP", rota: "/jogos/gates-olympus", capa: "⚡", subtitle: "Power scatter", badge: "Top", accentClass: "from-amber-300/20 via-sky-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(245,158,11,0.2)]" },
  { nome: "Wild West Gold", provider: "PP", rota: "/jogos/wild-west-gold", capa: "🏜️", subtitle: "Cowboy jackpot", accentClass: "from-orange-300/20 via-yellow-500/15 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(251,146,60,0.18)]" },
  { nome: "Starlight Princess", provider: "PP", rota: "/jogos/starlight-princess", capa: "⭐", subtitle: "Celestial reels", badge: "Premium", accentClass: "from-fuchsia-300/20 via-indigo-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(168,85,247,0.18)]" },
  { nome: "Big Bass Bonanza", provider: "PP", rota: "/jogos/big-bass-bonanza", capa: "🎣", subtitle: "Fishing spins", accentClass: "from-cyan-300/20 via-blue-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(56,189,248,0.18)]" },
  { nome: "Wolf Gold", provider: "PP", rota: "/jogos/wolf-gold", capa: "🐺", subtitle: "Moonlight wilds", badge: "Premium", accentClass: "from-slate-300/20 via-blue-500/15 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(148,163,184,0.18)]" },
  { nome: "Book of Fallen", provider: "PP", rota: "/jogos/book-of-fallen", capa: "📖", subtitle: "Dark temple bonus", badge: "Premium", accentClass: "from-rose-300/20 via-orange-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(251,113,133,0.18)]" },
  { nome: "Joker's Jewels", provider: "PP", rota: "/jogos/jokers-jewels", capa: "🃏", subtitle: "Classic 5-reel", badge: "Premium", accentClass: "from-violet-300/20 via-fuchsia-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(192,132,252,0.18)]" },
  // BetClean Originais
  { nome: "Mines", provider: "POPOK", rota: "/jogos/mines", capa: "💣", subtitle: "Tactical grid", badge: "Original", accentClass: "from-emerald-300/20 via-cyan-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(16,185,129,0.18)]" },
  { nome: "Orbit Wheel", provider: "POPOK", rota: "/jogos/orbit-wheel", capa: "🎡", subtitle: "Live wheel spin", badge: "Original", accentClass: "from-amber-300/20 via-emerald-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(251,191,36,0.18)]" },
  { nome: "Tower", provider: "G759", rota: "/jogos/tower", capa: "⬆️", subtitle: "Step-up volatility", badge: "Original", accentClass: "from-sky-300/20 via-indigo-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(96,165,250,0.18)]" },
  { nome: "Turbo Rise", provider: "G759", rota: "/jogos/turbo-rise", capa: "✈️", subtitle: "Crash desk", badge: "Live", accentClass: "from-amber-300/20 via-orange-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(251,146,60,0.18)]" },
  { nome: "Hi-Lo", provider: "Tada", rota: "/jogos/hi-lo", capa: "🃏", subtitle: "Cards & odds", badge: "Original", accentClass: "from-violet-300/20 via-pink-500/20 to-slate-950", glowClass: "shadow-[0_0_30px_rgba(168,85,247,0.18)]" },
];

const providerTone: Record<CatalogGame["provider"], string> = {
  PG: "text-amber-300",
  PP: "text-cyan-300",
  POPOK: "text-emerald-300",
  G759: "text-sky-300",
  Tada: "text-fuchsia-300",
};

export default function CatalogoPage() {
  const router = useRouter();
  const [providerAtivo, setProviderAtivo] = useState<CatalogGame["provider"] | "Todos">("Todos");
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    return jogos.filter((jogo) => {
      const matchProvider = providerAtivo === "Todos" || jogo.provider === providerAtivo;
      const matchBusca = jogo.nome.toLowerCase().includes(busca.toLowerCase().trim());
      return matchProvider && matchBusca;
    });
  }, [providerAtivo, busca]);

  function abrirJogo(rota?: string) {
    if (!rota) return;

    const emailSalvo = window.localStorage.getItem("demo-wallet-email");
    if (!emailSalvo) {
      router.push("/login");
      return;
    }

    router.push(rota);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_28%),#05070d] text-white">
      <PortalHeader />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="surface-card rounded-[30px] border border-white/10 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:p-6">
          <div className="mb-5 text-center">
            <p className="text-sm text-amber-300">BetClean Casino Lobby</p>
            <h1 className="mt-2 text-3xl font-bold headline-glow sm:text-4xl">Slot Lobby</h1>
            <p className="mt-2 text-sm text-white/60 sm:text-base">
              Catálogo premium com filtros por provedor, acesso rápido e a mesma atmosfera da página inicial.
            </p>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <span className="text-white/45">🔍</span>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar jogos"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setProviderAtivo("Todos")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                providerAtivo === "Todos"
                  ? "pill-brand"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              Todos
            </button>
            {providers.map((provider) => (
              <button
                key={provider}
                onClick={() => setProviderAtivo(provider)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  providerAtivo === provider
                    ? "pill-brand"
                    : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {provider}
              </button>
            ))}
          </div>

          <div className="mb-5 grid gap-3 rounded-[26px] border border-white/10 bg-black/20 p-3 sm:grid-cols-3 xl:grid-cols-4">
            <div className="rounded-[24px] border border-amber-400/15 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 xl:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Featured Lobby</p>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Catálogo com cara de cassino</h2>
              <p className="mt-3 max-w-2xl text-sm text-white/65 sm:text-base">
                Cards com atmosfera própria, leitura por provedor e profundidade visual consistente com o restante da operação.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-amber-200">Top Slots</span>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">Provider Mix</span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">Casino UI</span>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Providers</p>
              <p className="mt-3 text-3xl font-bold text-white">{providers.length}</p>
              <p className="mt-2 text-sm text-white/55">curados no mesmo ambiente</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Jogos visíveis</p>
              <p className="mt-3 text-3xl font-bold text-white">{filtrados.length}</p>
              <p className="mt-2 text-sm text-white/55">com acesso imediato</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtrados.map((jogo) => (
              <button
                key={`${jogo.provider}-${jogo.nome}`}
                onClick={() => abrirJogo(jogo.rota)}
                className={`group catalog-card-shine relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-3 text-left shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.07] ${jogo.glowClass}`}
              >
                <div className="absolute right-3 top-3 z-10 flex gap-2">
                  {jogo.badge && (
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">
                      {jogo.badge}
                    </span>
                  )}
                </div>

                <div className={`mb-3 flex h-28 items-end justify-between rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_50%)] bg-gradient-to-br p-4 text-4xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition group-hover:border-amber-400/30 ${jogo.accentClass}`}>
                  <span className="text-5xl drop-shadow-[0_12px_20px_rgba(0,0,0,0.35)] transition group-hover:scale-110">{jogo.capa}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.28em] ${providerTone[jogo.provider]}`}>
                    {jogo.provider}
                  </span>
                </div>
                <p className="line-clamp-1 text-sm font-semibold text-white">{jogo.nome}</p>
                <p className="mt-1 line-clamp-1 text-xs text-white/50">{jogo.subtitle}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/35">
                  <span>{jogo.provider}</span>
                  <span>Enter</span>
                </div>
              </button>
            ))}
          </div>

          {filtrados.length === 0 && (
            <p className="py-10 text-center text-sm text-white/45">Nenhum jogo encontrado para este filtro.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
