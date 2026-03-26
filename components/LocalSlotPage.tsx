"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";

type LocalSlotPageProps = {
  title: string;
  subtitle: string;
  icon: string;
  themeClass: string;
  symbols: string[];
};

function randomSymbol(symbols: string[]) {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
}

export default function LocalSlotPage({
  title,
  subtitle,
  icon,
  themeClass,
  symbols,
}: LocalSlotPageProps) {
  const router = useRouter();
  const { saldo, setSaldo, registrarResultado } = useDemoWallet();

  const [telaCheia, setTelaCheia] = useState(false);

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setTelaCheia(true);
    } else {
      document.exitFullscreen();
      setTelaCheia(false);
    }
  }

  const [aposta, setAposta] = useState(100);
  const [girando, setGirando] = useState(false);
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [mensagem, setMensagem] = useState("Clique em GIRAR para jogar");
  const [ultimoPremio, setUltimoPremio] = useState(0);

  function calcularPremio(resultado: string[]) {
    if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) {
      return aposta * 10;
    }
    if (
      resultado[0] === resultado[1] ||
      resultado[1] === resultado[2] ||
      resultado[0] === resultado[2]
    ) {
      return aposta * 2;
    }
    return 0;
  }

  function girar() {
    if (girando || saldo < aposta) {
      return;
    }

    setGirando(true);
    setMensagem("Girando...");

    setTimeout(() => {
      const novoResultado = [
        randomSymbol(symbols),
        randomSymbol(symbols),
        randomSymbol(symbols),
      ];

      const premio = calcularPremio(novoResultado);

      setReels(novoResultado);
      setSaldo((valorAtual) => valorAtual - aposta + premio);
      registrarResultado(aposta, premio);
      setUltimoPremio(premio);

      if (premio > 0) {
        setMensagem(`Voce ganhou ${premio.toLocaleString("pt-BR")} moedas!`);
      } else {
        setMensagem("Sem premio nesta rodada. Tente novamente!");
      }

      setGirando(false);
    }, 900);
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
            <h1 className="text-sm font-semibold sm:text-base">
              {icon} {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-amber-300 sm:text-sm">
              Saldo: {saldo.toLocaleString("pt-BR")} moedas
            </p>
            <button
              onClick={toggleFullscreen}
              title={telaCheia ? "Sair da tela cheia" : "Tela cheia"}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/20"
            >
              {telaCheia ? "⊠" : "⛶"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className={`w-full max-w-4xl rounded-3xl border border-white/10 p-6 ${themeClass}`}>
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="mt-2 text-white/70">{subtitle}</p>
          </div>

          <div className="mb-6 rounded-2xl bg-black/40 p-6">
            <div className="grid grid-cols-3 gap-4">
              {reels.map((symbol, idx) => (
                <div
                  key={idx}
                  className="flex h-28 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-5xl"
                >
                  {symbol}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {[50, 100, 250, 500, 1000].map((valor) => (
              <button
                key={valor}
                disabled={girando}
                onClick={() => setAposta(valor)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  aposta === valor
                    ? "bg-amber-500 text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {valor.toLocaleString("pt-BR")}
              </button>
            ))}
          </div>

          <div className="mb-5 text-center text-sm text-white/80">{mensagem}</div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={girar}
              disabled={girando || saldo < aposta}
              className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3 font-bold text-black transition hover:scale-[1.02] disabled:opacity-50"
            >
              {girando ? "Girando..." : "GIRAR"}
            </button>

            <div className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm">
              Ultimo premio: <strong>{ultimoPremio.toLocaleString("pt-BR")}</strong>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-blue-500/25 bg-blue-500/10 p-3 text-center text-xs text-white/75">
            Modo local BetClean: jogo estavel, sem erro de provider externo.
          </div>
        </div>
      </div>
    </div>
  );
}
