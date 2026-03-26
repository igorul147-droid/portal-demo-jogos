"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Footer from "@/components/Footer";

export default function SweetBonanzaPage() {
  const router = useRouter();
  const { saldo } = useDemoWallet();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="border-b border-white/10 bg-black/20 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push("/")} className="text-white/70 hover:text-white transition">
                ← Voltar
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Sweet Bonanza</h1>
                <p className="text-sm text-white/60">Pragmatic Play</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-white/60">Saldo Disponível</p>
                <p className="text-lg font-bold text-amber-400">
                  R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <a
                href="https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pt&cur=BRL&gameSymbol=vs20fruitsw&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99"
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
        <div className="bg-black/40 rounded-2xl p-4 backdrop-blur">
          <div className="mb-4 flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">RTP: 96.48%</span>
            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full">Volatilidade: Alta</span>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">Máx: x100</span>
            <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full">🍭 Candy Theme</span>
          </div>

          <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
            {carregando && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mb-4"></div>
                <p className="text-white/70 text-sm">Carregando Sweet Bonanza...</p>
              </div>
            )}
            <iframe
              src="https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pt&cur=BRL&gameSymbol=vs20fruitsw&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99"
              className="w-full h-full border-0"
              title="Sweet Bonanza"
              allowFullScreen
              onLoad={() => setCarregando(false)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">🎯 Como Jogar</h3>
              <p className="text-sm text-white/70">6 rolos com sistema Tumble. Combine 8+ símbolos para ganhar</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">🎁 Recursos</h3>
              <p className="text-sm text-white/70">Free spins com multiplicadores crescentes até x100</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">💰 Apostas</h3>
              <p className="text-sm text-white/70">Configuração flexível de aposta e sessão segura</p>
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