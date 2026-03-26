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
  { nome: "Fortune Tiger", provider: "PG", rota: "/jogos/fortune-tiger", capa: "🐯" },
  { nome: "Mahjong Ways", provider: "PG", rota: "/jogos/mahjong-ways", capa: "🎋" },
  { nome: "Dragon Hatch", provider: "PG", rota: "/jogos/dragon-hatch", capa: "🐉" },
  { nome: "Sweet Bonanza", provider: "PP", rota: "/jogos/sweet-bonanza", capa: "🍭" },
  { nome: "Gates of Olympus", provider: "PP", rota: "/jogos/gates-olympus", capa: "⚡" },
  { nome: "Wild West Gold", provider: "PP", rota: "/jogos/wild-west-gold", capa: "🏜️" },
  { nome: "Mines", provider: "POPOK", rota: "/jogos/mines", capa: "💣" },
  { nome: "Tower", provider: "G759", rota: "/jogos/tower", capa: "⬆️" },
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
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <PortalHeader />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h1 className="mb-4 text-center text-3xl font-bold">Slot Lobby</h1>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
            <span className="text-neutral-500">🔍</span>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar jogos"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setProviderAtivo("Todos")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                providerAtivo === "Todos"
                  ? "bg-blue-600 text-white"
                  : "border border-neutral-300 bg-white text-neutral-600"
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
                    ? "bg-blue-600 text-white"
                    : "border border-neutral-300 bg-white text-neutral-600"
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
                className="rounded-2xl border border-neutral-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-2 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 text-4xl">
                  {jogo.capa}
                </div>
                <p className="line-clamp-1 text-sm font-semibold">{jogo.nome}</p>
                <p className="mt-1 text-xs text-neutral-500">{jogo.provider}</p>
              </button>
            ))}
          </div>

          {filtrados.length === 0 && (
            <p className="py-10 text-center text-sm text-neutral-500">Nenhum jogo encontrado para este filtro.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
