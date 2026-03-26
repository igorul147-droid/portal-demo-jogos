"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Footer from "@/components/Footer";
import { formatBRL } from "@/lib/currency";

const LINHAS = 8;
const COLUNAS = 3;

// Cada linha tem 1 bomba aleatória
function gerarAndar(): number {
  return Math.floor(Math.random() * COLUNAS);
}

const MULTIPLICADORES = [1.5, 2.0, 3.0, 4.5, 7.0, 11.0, 17.0, 26.0];

type LinhaState = "hidden" | "correto" | "errado" | "escolhido";

export default function TowerPage() {
  const router = useRouter();
  const { saldo, setSaldo, registrarResultado } = useDemoWallet();

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  const [aposta, setAposta] = useState(100);
  const [jogando, setJogando] = useState(false);
  const [encerrado, setEncerrado] = useState(false);
  const [andarAtual, setAndarAtual] = useState(0);
  const [bombas, setBombas] = useState<number[]>([]);
  const [escolhas, setEscolhas] = useState<(number | null)[]>(Array(LINHAS).fill(null));
  const [resultado, setResultado] = useState<"win" | "loss" | null>(null);
  const [ganhoFinal, setGanhoFinal] = useState(0);

  function iniciar() {
    if (saldo < aposta) return;
    const novasBombas = Array.from({ length: LINHAS }, () => gerarAndar());
    setSaldo(saldo - aposta);
    setBombas(novasBombas);
    setEscolhas(Array(LINHAS).fill(null));
    setAndarAtual(0);
    setResultado(null);
    setGanhoFinal(0);
    setEncerrado(false);
    setJogando(true);
  }

  function escolher(coluna: number) {
    if (!jogando || encerrado) return;

    const novasEscolhas = [...escolhas];
    novasEscolhas[andarAtual] = coluna;
    setEscolhas(novasEscolhas);

    if (coluna === bombas[andarAtual]) {
      // Bomba!
      setResultado("loss");
      setJogando(false);
      setEncerrado(true);
      registrarResultado(aposta, 0);
    } else {
      const proximoAndar = andarAtual + 1;
      if (proximoAndar >= LINHAS) {
        // Venceu todos os andares!
        const ganho = Math.floor(aposta * MULTIPLICADORES[LINHAS - 1]);
        setSaldo(saldo - aposta + ganho);
        registrarResultado(aposta, ganho);
        setGanhoFinal(ganho);
        setResultado("win");
        setJogando(false);
        setEncerrado(true);
      } else {
        setAndarAtual(proximoAndar);
      }
    }
  }

  function cashout() {
    if (!jogando || andarAtual === 0) return;
    const ganho = Math.floor(aposta * MULTIPLICADORES[andarAtual - 1]);
    setSaldo(saldo - aposta + ganho);
    registrarResultado(aposta, ganho);
    setGanhoFinal(ganho);
    setResultado("win");
    setJogando(false);
    setEncerrado(true);
  }

  function getColunaIcon(linhaIdx: number, colIdx: number) {
    const escolha = escolhas[linhaIdx];
    if (escolha === null) return null;

    if (encerrado || linhaIdx < andarAtual) {
      if (colIdx === bombas[linhaIdx]) return "💣";
      if (colIdx === escolha) return "✅";
    }
    return null;
  }

  const ganhoSecao = andarAtual > 0 ? Math.floor(aposta * MULTIPLICADORES[andarAtual - 1]) : 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.20),transparent_38%),#050811] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-white/70 hover:text-white transition">
              ← Voltar
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Tower</h1>
              <p className="text-sm text-white/60">BetClean Original • Ascension</p>
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

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Banner Resultado */}
        {resultado && (
          <div className={`mb-6 rounded-2xl p-4 text-center text-lg font-bold ${
            resultado === "win"
              ? "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300"
              : "bg-red-500/20 border border-red-400/40 text-red-300"
          }`}>
            {resultado === "win"
              ? `Retorno confirmado: ${formatBRL(ganhoFinal)}`
              : "Trajeto interrompido. Nenhum retorno nesta rodada."}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_260px] gap-6">
          {/* Torre */}
          <div className="rounded-3xl border border-indigo-400/20 bg-black/40 p-4 shadow-[0_0_24px_rgba(99,102,241,0.10)]">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/55">
              <span>Climb Grid</span>
              <span>8 níveis</span>
            </div>
            <div className="space-y-2">
              {Array.from({ length: LINHAS }).map((_, linhaIdx) => {
                const andInvertido = LINHAS - 1 - linhaIdx;
                const isAtivo = jogando && andInvertido === andarAtual;
                const isPast = !encerrado && andInvertido < andarAtual;
                const isFuture = !jogando || andInvertido > andarAtual;
                const escolha = escolhas[andInvertido];
                const mult = MULTIPLICADORES[andInvertido];

                return (
                  <div
                    key={andInvertido}
                    className={`rounded-xl border p-2 transition-all ${
                      isAtivo
                        ? "border-amber-400/60 bg-amber-400/10"
                        : isPast
                        ? "border-emerald-400/30 bg-emerald-400/5"
                        : "border-white/5 bg-white/5 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-14 text-right text-xs text-white/50 font-mono">
                        {mult}x
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        {Array.from({ length: COLUNAS }).map((_, colIdx) => {
                          const icon = getColunaIcon(andInvertido, colIdx);
                          return (
                            <button
                              key={colIdx}
                              disabled={!isAtivo}
                              onClick={() => escolher(colIdx)}
                              className={`rounded-lg py-3 text-sm font-black uppercase tracking-[0.15em] transition-all ${
                                isAtivo
                                  ? "bg-white/10 hover:bg-white/20 active:scale-95 cursor-pointer border border-white/20"
                                  : icon === "💣"
                                  ? "bg-red-600/50 border border-red-500/50"
                                  : icon === "✅"
                                  ? "bg-emerald-500/30 border border-emerald-400/50"
                                  : "bg-white/5 border border-white/5"
                              }`}
                            >
                              {icon === "💣" ? "MINE" : icon === "✅" ? "SAFE" : isAtivo ? "PICK" : ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Painel */}
          <div className="space-y-4">
            {/* Progresso */}
            {jogando && andarAtual > 0 && (
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-1">Valor protegido</p>
                <p className="text-2xl font-bold text-emerald-300">{formatBRL(ganhoSecao)}</p>
                <p className="text-sm text-white/60">Andar {andarAtual} de {LINHAS}</p>
              </div>
            )}

            {/* Config */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-white/70">Aposta</h3>
              <div className="grid grid-cols-2 gap-2">
                {[50, 100, 250, 500, 1000, 2500].map(v => (
                  <button
                    key={v}
                    disabled={jogando}
                    onClick={() => setAposta(v)}
                    className={`py-2 rounded-lg text-sm font-semibold transition ${
                      aposta === v
                        ? "bg-amber-500 text-black"
                        : "bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
                    }`}
                  >
                    {formatBRL(v)}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiplicadores */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-white/70">Multiplicadores</h3>
              <div className="space-y-1">
                {MULTIPLICADORES.slice().reverse().map((m, i) => (
                  <div key={i} className="flex justify-between text-xs text-white/60">
                    <span>Andar {LINHAS - i}</span>
                    <span className="text-emerald-300 font-semibold">{m}x</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-2">
              {!jogando ? (
                <button
                  onClick={iniciar}
                  disabled={saldo < aposta}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 py-4 font-bold text-white text-lg transition hover:scale-[1.02] disabled:opacity-50"
                >
                  {encerrado ? "Nova escalada" : "Iniciar escalada"}
                </button>
              ) : (
                <button
                  onClick={cashout}
                  disabled={andarAtual === 0}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 font-bold text-white text-lg transition hover:scale-[1.02] disabled:opacity-50"
                >
                  Encerrar e sacar ({formatBRL(ganhoSecao)})
                </button>
              )}
            </div>

            <div className="rounded-3xl bg-blue-500/10 border border-blue-500/20 p-4 text-sm text-white/70 space-y-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-300">Como operar</p>
              <p>• Escolha 1 bloco por andar (evite a bomba)</p>
              <p>• Cada andar correto aumenta o multiplicador</p>
              <p>• Saque a qualquer momento para garantir lucro</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
