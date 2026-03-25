"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Footer from "@/components/Footer";

export default function DragonHatchPage() {
  const router = useRouter();
  const { saldo } = useDemoWallet();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setCarregando(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white">Carregando Dragon Hatch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push("/")} className="text-white/70 hover:text-white transition">
                ← Voltar
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Dragon Hatch</h1>
                <p className="text-sm text-white/60">PG Soft - Demo Gratuito</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Saldo Demo</p>
              <p className="text-lg font-bold text-amber-400">
                R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="bg-black/40 rounded-2xl p-6 backdrop-blur">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">🐉 Dragon Hatch</h2>
            <p className="text-white/70 mb-4">Dragões misteriosos e ovos cheios de surpresas!</p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">RTP: 96.70%</span>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">Volatilidade: Alta</span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">Linhas: 20</span>
            </div>
          </div>

          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
            <iframe
              src="https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=EUR&gameSymbol=vs20dragon&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99"
              className="w-full h-full border-0"
              title="Dragon Hatch Demo"
              allowFullScreen
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">🎯 Como Jogar</h3>
              <p className="text-sm text-white/70">Quebre ovos para liberar dragões</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">🎁 Recursos</h3>
              <p className="text-sm text-white/70">Ovos misteriosos + multiplicadores</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">💰 Apostas</h3>
              <p className="text-sm text-white/70">Demo gratuito - sem risco real</p>
            </div>
          </div>

          <div className="mt-6 bg-amber-400/10 border border-amber-400/20 rounded-xl p-4">
            <p className="text-amber-300 text-sm text-center">
              ⚠️ Este é um jogo demo gratuito. Para apostas reais, você precisa de uma conta verificada e PSP integrado.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}