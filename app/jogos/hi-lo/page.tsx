"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Footer from "@/components/Footer";
import { formatBRL } from "@/lib/currency";

const NAIPES = ["♠", "♥", "♦", "♣"];
const VALORES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const VALOR_NUMERICO: Record<string, number> = {
  A: 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
  "8": 8, "9": 9, "10": 10, J: 11, Q: 12, K: 13,
};

function cartaAleatoria() {
  return {
    valor: VALORES[Math.floor(Math.random() * VALORES.length)],
    naipe: NAIPES[Math.floor(Math.random() * NAIPES.length)],
  };
}

type Carta = { valor: string; naipe: string };

function isVermelha(naipe: string) {
  return naipe === "♥" || naipe === "♦";
}

export default function HiLoPage() {
  const router = useRouter();
  const { saldo, setSaldo, registrarResultado } = useDemoWallet();

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  const [aposta, setAposta] = useState(100);
  const [jogando, setJogando] = useState(false);
  const [cartaAtual, setCartaAtual] = useState<Carta | null>(null);
  const [historico, setHistorico] = useState<Carta[]>([]);
  const [acertos, setAcertos] = useState(0);
  const [lucroAcumulado, setLucroAcumulado] = useState(0);
  const [resultado, setResultado] = useState<"win" | "loss" | null>(null);
  const [encerrado, setEncerrado] = useState(false);

  const multiplicador = acertos === 0 ? 1 : parseFloat((1 + acertos * 0.5).toFixed(2));

  function iniciar() {
    if (saldo < aposta) return;
    setSaldo(saldo - aposta);
    const carta = cartaAleatoria();
    setCartaAtual(carta);
    setHistorico([carta]);
    setAcertos(0);
    setLucroAcumulado(0);
    setResultado(null);
    setEncerrado(false);
    setJogando(true);
  }

  function adivinhar(palpite: "higher" | "lower" | "equal") {
    if (!jogando || !cartaAtual) return;

    const novaCarta = cartaAleatoria();
    const valorAtual = VALOR_NUMERICO[cartaAtual.valor];
    const valorNovo = VALOR_NUMERICO[novaCarta.valor];

    let acertou = false;
    if (palpite === "higher") acertou = valorNovo > valorAtual;
    else if (palpite === "lower") acertou = valorNovo < valorAtual;
    else acertou = valorNovo === valorAtual;

    const novoHistorico = [...historico, novaCarta];
    setCartaAtual(novaCarta);
    setHistorico(novoHistorico);

    if (acertou) {
      const novosAcertos = acertos + 1;
      const mult = parseFloat((1 + novosAcertos * 0.5).toFixed(2));
      setAcertos(novosAcertos);
      setLucroAcumulado(Math.floor(aposta * mult));
    } else {
      setResultado("loss");
      setJogando(false);
      setEncerrado(true);
      registrarResultado(aposta, 0);
    }
  }

  function cashout() {
    if (!jogando || acertos === 0) return;
    setSaldo(saldo - aposta + lucroAcumulado);
    registrarResultado(aposta, lucroAcumulado);
    setResultado("win");
    setJogando(false);
    setEncerrado(true);
  }

  function CardDisplay({ carta, small = false }: { carta: Carta; small?: boolean }) {
    const vermelho = isVermelha(carta.naipe);
    return (
      <div className={`rounded-xl bg-white flex flex-col items-center justify-center font-bold shadow-lg select-none ${
        small ? "w-12 h-16 text-sm" : "w-28 h-40 text-3xl"
      } ${vermelho ? "text-red-600" : "text-neutral-900"}`}>
        <span>{carta.valor}</span>
        <span className={small ? "text-base" : "text-4xl"}>{carta.naipe}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_34%),#050811] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-white/70 hover:text-white transition">
              ← Voltar
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Hi-Lo</h1>
              <p className="text-sm text-white/60">BetClean Original • Cards</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Saldo</p>
            <p className="text-lg font-bold text-amber-400">
              {formatBRL(saldo)}
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Banner Resultado */}
        {resultado && (
          <div className={`mb-6 rounded-2xl p-4 text-center text-lg font-bold ${
            resultado === "win"
              ? "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300"
              : "bg-red-500/20 border border-red-400/40 text-red-300"
          }`}>
            {resultado === "win"
              ? `Saque realizado: ${formatBRL(lucroAcumulado)} (${multiplicador}x)`
              : "Previsão incorreta. A rodada foi encerrada."}
          </div>
        )}

        {/* Área da Carta */}
        <div className="mb-6 rounded-3xl border border-sky-400/20 bg-black/40 p-8 shadow-[0_0_24px_rgba(59,130,246,0.10)]">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/55">
            <span>Table</span>
            <span>1 deck mode</span>
          </div>
          {!cartaAtual ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-28 h-40 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-4xl">
                🃏
              </div>
              <p className="text-white/50">Inicie o jogo para revelar uma carta</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <CardDisplay carta={cartaAtual} />

              {/* Histórico */}
              {historico.length > 1 && (
                <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
                  {historico.slice(0, -1).map((c, i) => (
                    <CardDisplay key={i} carta={c} small />
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 w-full text-center">
                <div className="bg-white/5 rounded-2xl p-3">
                  <p className="text-xs text-white/50">Acertos</p>
                  <p className="text-xl font-bold text-emerald-300">{acertos}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3">
                  <p className="text-xs text-white/50">Multiplicador</p>
                  <p className="text-xl font-bold text-amber-300">{multiplicador}x</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3">
                  <p className="text-xs text-white/50">Ganho</p>
                  <p className="text-xl font-bold text-blue-300">{formatBRL(lucroAcumulado)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controles */}
        {!jogando ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 250, 500, 1000, 2500].map(v => (
                <button
                  key={v}
                  onClick={() => setAposta(v)}
                  className={`py-2 rounded-xl text-sm font-semibold transition ${
                    aposta === v ? "bg-amber-500 text-black" : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {formatBRL(v)}
                </button>
              ))}
            </div>
            <button
              onClick={iniciar}
              disabled={saldo < aposta}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white text-lg transition hover:scale-[1.02] disabled:opacity-50"
            >
              {encerrado ? "Nova mão" : "Abrir mesa"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => adivinhar("lower")}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 py-4 font-bold text-white text-lg transition active:scale-95"
              >
                Lower
              </button>
              <button
                onClick={() => adivinhar("equal")}
                className="rounded-xl bg-purple-600 hover:bg-purple-500 py-4 font-bold text-white text-lg transition active:scale-95"
              >
                Equal
              </button>
              <button
                onClick={() => adivinhar("higher")}
                className="rounded-xl bg-red-600 hover:bg-red-500 py-4 font-bold text-white text-lg transition active:scale-95"
              >
                Higher
              </button>
            </div>

            <button
              onClick={cashout}
              disabled={acertos === 0}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 font-bold text-white transition disabled:opacity-50"
            >
              Encerrar e sacar ({formatBRL(lucroAcumulado)})
            </button>
          </div>
        )}

        <div className="mt-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 p-4 text-sm text-white/70 space-y-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-300">Como operar</p>
          <p>• Adivinhe se a próxima carta é Maior, Menor ou Igual</p>
          <p>• Cada acerto aumenta o multiplicador em 0.5x</p>
          <p>• Saque quando quiser para garantir seus ganhos</p>
          <p>• "Igual" vale 5x multiplicador numa só carta</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
