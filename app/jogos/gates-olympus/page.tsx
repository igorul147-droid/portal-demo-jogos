"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
const gameUrl =
  "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pt&cur=BRL&gameSymbol=vs20olympgate&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99";

export default function GatesOlympusPage() {
  const router = useRouter();
  const { saldo } = useDemoWallet();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
    const timer = setTimeout(() => setCarregando(false), 2000);
    return () => clearTimeout(timer);
  }, [router]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white">Carregando Gates of Olympus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white">
      <div className="h-16 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-white/70 transition hover:text-white"
            >
              ← Voltar
            </button>
            <h1 className="text-sm font-semibold sm:text-base">⚡ Gates of Olympus</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden text-xs text-amber-300 sm:block">
              Saldo: R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <a
              href={gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/20 transition"
            >
              Nova Aba
            </a>
            <button
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 transition"
            >
              ⛶ Tela Cheia
            </button>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-4rem)] w-full">
        {carregando && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
            <div className="text-center">
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-amber-400" />
              <p className="text-sm text-white/80">Carregando Gates of Olympus...</p>
            </div>
          </div>
        )}
        <iframe
          src={gameUrl}
          className="h-full w-full border-0"
          title="Gates of Olympus Demo"
          allowFullScreen
        />
      </div>
    </div>
  );
}