"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Footer from "@/components/Footer";
import { formatBRL } from "@/lib/currency";

const demoUrl =
  "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pt&cur=BRL&gameSymbol=vs20fruitsw&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99";

export default function SweetBonanzaPage() {
  const router = useRouter();
  const { saldo } = useDemoWallet();
  const [carregando, setCarregando] = useState(true);
  const [gameUrl, setGameUrl] = useState(demoUrl);
  const [integrado, setIntegrado] = useState(false);

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");

    async function carregarLaunchUrl() {
      try {
        const resposta = await fetch("/api/provider/launch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameSymbol: "vs20fruitsw",
            playerId: email ?? "guest",
            balance: saldo,
            currency: "BRL",
            locale: "pt-BR",
          }),
        });

        if (!resposta.ok) return;

        const payload = (await resposta.json()) as {
          launchUrl?: string;
          integrated?: boolean;
        };

        if (payload.launchUrl) {
          setGameUrl(payload.launchUrl);
        }

        setIntegrado(Boolean(payload.integrated));
      } catch {
        setGameUrl(demoUrl);
        setIntegrado(false);
      }
    }

    carregarLaunchUrl();
  }, [router]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.16),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.12),_transparent_26%),#0a0a0f]">
      <div className="border-b border-white/10 bg-black/25 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push("/")} className="text-white/70 hover:text-white transition">
                ← Voltar
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Sweet Bonanza</h1>
                <p className="text-sm text-white/60">Pragmatic Play • Candy Cluster</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-white/60">Carteira BetClean</p>
                <p className="text-lg font-bold text-amber-400">
                  {formatBRL(saldo)}
                </p>
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
                className="rounded-xl bg-pink-600 text-white px-4 py-2 text-sm font-semibold hover:bg-pink-500 transition"
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
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">RTP 96.48%</span>
            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full">Volatilidade alta</span>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">Max Win x21.100</span>
            <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full">Sessão BRL</span>
            <span className={`px-3 py-1 rounded-full ${integrado ? "bg-emerald-500/20 text-emerald-300" : "bg-cyan-500/20 text-cyan-300"}`}>
              {integrado ? "Wallet integrada" : "Modo demo do provedor"}
            </span>
          </div>

          {!integrado && (
            <div className="mb-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              Saldo exibido no topo refere-se a carteira da plataforma. O valor
              interno do iframe do provedor pode seguir uma carteira separada.
            </div>
          )}

          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-4 border border-white/10">
            {carregando && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mb-4"></div>
                <p className="text-white/70 text-sm">Inicializando mesa Sweet Bonanza...</p>
              </div>
            )}
            <iframe
              src={gameUrl}
              className="w-full h-full border-0"
              title="Sweet Bonanza"
              allowFullScreen
              onLoad={() => setCarregando(false)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">Mecânica</h3>
              <p className="text-sm text-white/70">6 colunas com sistema tumble e pagamentos por grupos a partir de 8 símbolos.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">Recursos</h3>
              <p className="text-sm text-white/70">Rodadas gratuitas com multiplicadores progressivos de até 100x.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">Operação</h3>
              <p className="text-sm text-white/70">Ajuste de stake integrado ao ambiente do provedor com sessão segura.</p>
            </div>
          </div>

          <div className="mt-4 bg-amber-400/10 border border-amber-400/20 rounded-xl p-4">
            <p className="text-amber-300 text-sm text-center">
              ⚠️ Jogue com responsabilidade. Defina seus limites antes de iniciar.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}