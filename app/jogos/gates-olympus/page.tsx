"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Footer from "@/components/Footer";
import { formatBRL } from "@/lib/currency";
const gameUrl =
  "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pt&cur=BRL&gameSymbol=vs20olympgate&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99";

export default function GatesOlympusPage() {
  const router = useRouter();
  const { saldo } = useDemoWallet();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_24%),#09090b] text-white">
      <div className="border-b border-white/10 bg-black/25 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-white/70 transition hover:text-white"
            >
              ← Voltar
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Gates of Olympus</h1>
              <p className="text-sm text-white/60">Pragmatic Play • Power Scatter</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white/60">Saldo disponível</p>
              <p className="text-lg font-bold text-amber-400">{formatBRL(saldo)}</p>
            </div>
            <a
              href={gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white/10 text-white/80 px-3 py-2 text-sm hover:bg-white/20 transition"
            >
              Nova Aba
            </a>
            <button
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
            >
              ⛶ Tela Cheia
            </button>
          </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-3xl border border-white/10 bg-black/35 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="mb-4 flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">RTP 96.50%</span>
            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full">Volatilidade alta</span>
            <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full">Max Win x5.000</span>
            <span className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full">Sessão BRL</span>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
            {carregando && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-amber-400" />
                  <p className="text-sm text-white/80">Inicializando mesa Gates of Olympus...</p>
                </div>
              </div>
            )}
            <iframe
              src={gameUrl}
              className="h-full w-full border-0"
              title="Gates of Olympus"
              allowFullScreen
              onLoad={() => setCarregando(false)}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">Mecânica</h3>
              <p className="text-sm text-white/70">6 colunas com pagamentos por cluster e tumbling a cada combinação.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">Recursos</h3>
              <p className="text-sm text-white/70">Multiplicadores aleatórios com gatilho de free spins via scatters.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">Operação</h3>
              <p className="text-sm text-white/70">Sessão em BRL com ajuste de stake dentro do cliente do provedor.</p>
            </div>
          </div>

          <div className="mt-4 bg-amber-400/10 border border-amber-400/20 rounded-xl p-4">
            <p className="text-amber-300 text-sm text-center">
              ⚠️ Jogue com responsabilidade. Defina limites de tempo e valor antes de iniciar.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}