"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import { formatBRL } from "@/lib/currency";

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

function symbolLabel(symbol: string) {
  const map: Record<string, string> = {
    "🐯": "WILD",
    "🪙": "COIN",
    "🍀": "LUCK",
    "💎": "GEM",
    "🔥": "FIRE",
    "⭐": "STAR",
    "🀄": "MAHJ",
    "🎍": "BAMB",
    "🏮": "LAMP",
    "💠": "RUNE",
    "🐉": "DRGN",
    "🤠": "COWB",
    "💰": "GOLD",
    "🔫": "SHOT",
    "🐎": "HORSE",
    "🥚": "EGG",
    "⚔️": "BLADE",
    "👑": "KING",
  };

  return map[symbol] ?? symbol.toUpperCase().slice(0, 5);
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
  const [mensagem, setMensagem] = useState("Mesa pronta para nova rodada");
  const [ultimoPremio, setUltimoPremio] = useState(0);
  const [rodadas, setRodadas] = useState(0);
  const [totalGanho, setTotalGanho] = useState(0);

  const taxaRetorno = useMemo(() => {
    if (rodadas === 0) return 0;
    const totalApostado = rodadas * aposta;
    if (totalApostado === 0) return 0;
    return Math.round((totalGanho / totalApostado) * 100);
  }, [aposta, rodadas, totalGanho]);

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
    setMensagem("Spin em processamento...");

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
      setRodadas((valor) => valor + 1);
      setTotalGanho((valor) => valor + premio);

      if (premio > 0) {
        setMensagem(`Rodada liquidada com ${formatBRL(premio)}.`);
      } else {
        setMensagem("Sem prêmio nesta rodada.");
      }

      setGirando(false);
    }, 900);
  }

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.22),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_24%),#04070d] text-white">
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
              Saldo: {formatBRL(saldo)}
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
        <div className={`surface-card w-full max-w-6xl rounded-[32px] border border-amber-400/20 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] ${themeClass}`}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold">{title}</h2>
              <p className="mt-1 text-sm text-white/70">{subtitle}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-300">RTP 96.40%</span>
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-amber-300">Volatilidade Alta</span>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-300">Session BRL</span>
            </div>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Carteira</p>
              <p className="mt-2 text-lg font-bold text-emerald-300">{formatBRL(saldo)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Aposta</p>
              <p className="mt-2 text-lg font-bold text-white">{formatBRL(aposta)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Último ganho</p>
              <p className="mt-2 text-lg font-bold text-amber-200">{formatBRL(ultimoPremio)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">RTP sessão</p>
              <p className="mt-2 text-lg font-bold text-cyan-200">{taxaRetorno}%</p>
            </div>
          </div>

          <div className="mb-6 rounded-[28px] border border-white/10 bg-black/45 p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/60">
              <span>3 reel engine</span>
              <span>Pagamentos instantâneos</span>
              <span>Motor interno premium</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {reels.map((symbol, idx) => (
                <div
                  key={idx}
                  className={`flex h-36 items-center justify-center rounded-[24px] border border-amber-300/20 bg-gradient-to-b from-white/10 to-white/5 text-2xl font-black tracking-[0.2em] text-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${girando ? "animate-reel-flicker" : ""}`}
                >
                  <div className="text-center">
                    <div className="text-4xl tracking-normal">{symbol}</div>
                    <div className="mt-3 text-lg tracking-[0.28em]">{symbolLabel(symbol)}</div>
                  </div>
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
                {formatBRL(valor)}
              </button>
            ))}
          </div>

          <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center text-sm text-white/80">{mensagem}</div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={girar}
              disabled={girando || saldo < aposta}
              className="rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-500 px-9 py-3 font-black uppercase tracking-wide text-black transition hover:scale-[1.02] disabled:opacity-50"
            >
              {girando ? "Spinning..." : "Spin"}
            </button>

            <div className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm">
              Ultimo premio: <strong>{formatBRL(ultimoPremio)}</strong>
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm">
              Rodadas: <strong>{rodadas}</strong>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-3 text-center text-xs text-white/70">
            Session ID local ativa • Motor RNG interno • Controles de aposta responsáveis
          </div>
        </div>
      </div>
    </div>
  );
}
