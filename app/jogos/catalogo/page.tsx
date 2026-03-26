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
};

const providers: CatalogGame["provider"][] = ["PG", "PP", "POPOK", "G759", "Tada"];

const jogos: CatalogGame[] = [
  // PG Soft
  { nome: "Fortune Tiger", provider: "PG", rota: "/jogos/fortune-tiger", capa: "🐯" },
  { nome: "Mahjong Ways", provider: "PG", rota: "/jogos/mahjong-ways", capa: "🎋" },
  { nome: "Dragon Hatch", provider: "PG", rota: "/jogos/dragon-hatch", capa: "🐉" },
  { nome: "Fortune Mouse", provider: "PG", rota: "/jogos/fortune-mouse", capa: "🐭" },
  { nome: "Wild Bandito", provider: "PG", rota: "/jogos/wild-bandito", capa: "🎸" },
  { nome: "Piggy Gold", provider: "PG", rota: "/jogos/piggy-gold", capa: "🐷" },
  { nome: "Candy Burst", provider: "PG", rota: "/jogos/candy-burst", capa: "🍬" },
  { nome: "Ganesha Gold", provider: "PG", rota: "/jogos/ganesha-gold", capa: "🐘" },
  { nome: "Leprechaun Riches", provider: "PG", rota: "/jogos/leprechaun-riches", capa: "☘️" },
  { nome: "Gem Saviour", provider: "PG", rota: "/jogos/gem-saviour", capa: "💎" },
  { nome: "Tree of Fortune", provider: "PG", rota: "/jogos/tree-of-fortune", capa: "🌳" },
  { nome: "Fortuna Neon", provider: "PG", rota: "/jogos/fortuna-neon", capa: "⚡" },
  // Pragmatic Play
  { nome: "Sweet Bonanza", provider: "PP", rota: "/jogos/sweet-bonanza", capa: "🍭" },
  { nome: "Gates of Olympus", provider: "PP", rota: "/jogos/gates-olympus", capa: "⚡" },
  { nome: "Wild West Gold", provider: "PP", rota: "/jogos/wild-west-gold", capa: "🏜️" },
  { nome: "Starlight Princess", provider: "PP", rota: "/jogos/starlight-princess", capa: "⭐" },
  { nome: "Big Bass Bonanza", provider: "PP", rota: "/jogos/big-bass-bonanza", capa: "🎣" },
  { nome: "Wolf Gold", provider: "PP", rota: "/jogos/wolf-gold", capa: "🐺" },
  { nome: "Book of Fallen", provider: "PP", rota: "/jogos/book-of-fallen", capa: "📖" },
  { nome: "Joker's Jewels", provider: "PP", rota: "/jogos/jokers-jewels", capa: "🃏" },
  // BetClean Originais
  { nome: "Mines", provider: "POPOK", rota: "/jogos/mines", capa: "💣" },
  { nome: "Orbit Wheel", provider: "POPOK", rota: "/jogos/orbit-wheel", capa: "🎡" },
  { nome: "Tower", provider: "G759", rota: "/jogos/tower", capa: "⬆️" },
  { nome: "Turbo Rise", provider: "G759", rota: "/jogos/turbo-rise", capa: "✈️" },
  { nome: "Hi-Lo", provider: "Tada", rota: "/jogos/hi-lo", capa: "🃏" },
];

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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtrados.map((jogo) => (
              <button
                key={`${jogo.provider}-${jogo.nome}`}
                onClick={() => abrirJogo(jogo.rota)}
                className="group rounded-[24px] border border-white/10 bg-white/5 p-3 text-left shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.07]"
              >
                <div className="mb-3 flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_50%),linear-gradient(135deg,rgba(30,41,59,0.9)_0%,rgba(15,23,42,0.95)_100%)] text-4xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition group-hover:border-amber-400/30">
                  {jogo.capa}
                </div>
                <p className="line-clamp-1 text-sm font-semibold text-white">{jogo.nome}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">{jogo.provider}</p>
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
