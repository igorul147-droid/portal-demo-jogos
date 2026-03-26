"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Footer from "@/components/Footer";

const GRID_SIZE = 25;

type CellState = "hidden" | "gem" | "bomb";

function gerarBombas(qtd: number, reveladas: Set<number>): Set<number> {
  const bombas = new Set<number>();
  while (bombas.size < qtd) {
    const pos = Math.floor(Math.random() * GRID_SIZE);
    if (!reveladas.has(pos)) bombas.add(pos);
  }
  return bombas;
}

function calcularMultiplicador(gemsReveladas: number, bombs: number): number {
  const gems = GRID_SIZE - bombs;
  let mult = 1;
  for (let i = 0; i < gemsReveladas; i++) {
    mult *= (gems - i) / (GRID_SIZE - i);
  }
  return parseFloat((0.95 / mult).toFixed(2));
}

export default function MinesPage() {
  const router = useRouter();
  const { saldo, setSaldo, registrarResultado } = useDemoWallet();

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  const [aposta, setAposta] = useState(100);
  const [bombs, setBombs] = useState(3);
  const [jogando, setJogando] = useState(false);
  const [encerrado, setEncerrado] = useState(false);
  const [cells, setCells] = useState<CellState[]>(Array(GRID_SIZE).fill("hidden"));
  const [bombPos, setBombPos] = useState<Set<number>>(new Set());
  const [reveladas, setReveladas] = useState<Set<number>>(new Set());
  const [ganhoAtual, setGanhoAtual] = useState(0);
  const [resultado, setResultado] = useState<"win" | "loss" | null>(null);

  const multiplicadorAtual = reveladas.size > 0
    ? calcularMultiplicador(reveladas.size, bombs)
    : 1;

  function iniciar() {
    if (saldo < aposta) return;
    setSaldo(saldo - aposta);
    const novaBombs = gerarBombas(bombs, new Set());
    setBombPos(novaBombs);
    setCells(Array(GRID_SIZE).fill("hidden"));
    setReveladas(new Set());
    setGanhoAtual(0);
    setResultado(null);
    setEncerrado(false);
    setJogando(true);
  }

  function revelarCelula(idx: number) {
    if (!jogando || encerrado || cells[idx] !== "hidden") return;

    const novasReveladas = new Set(reveladas);
    novasReveladas.add(idx);

    if (bombPos.has(idx)) {
      // Bomba! Mostrar tudo
      const novasCells = Array(GRID_SIZE).fill("hidden").map((_, i) =>
        bombPos.has(i) ? "bomb" : novasReveladas.has(i) ? "gem" : "hidden"
      ) as CellState[];
      setCells(novasCells);
      setReveladas(novasReveladas);
      setResultado("loss");
      setJogando(false);
      setEncerrado(true);
      registrarResultado(aposta, 0);
    } else {
      // Gem!
      const mult = calcularMultiplicador(novasReveladas.size, bombs);
      const ganho = parseFloat((aposta * mult).toFixed(2));
      const novasCells = [...cells] as CellState[];
      novasCells[idx] = "gem";
      setCells(novasCells);
      setReveladas(novasReveladas);
      setGanhoAtual(ganho);

      // Verificar se revelou todas as gems
      if (novasReveladas.size === GRID_SIZE - bombs) {
        setSaldo(saldo - aposta + ganho);
        registrarResultado(aposta, ganho);
        setResultado("win");
        setJogando(false);
        setEncerrado(true);
      }
    }
  }

  function cashout() {
    if (!jogando || reveladas.size === 0) return;
    setSaldo(saldo - aposta + ganhoAtual);
    registrarResultado(aposta, ganhoAtual);
    // Revelar bombas
    const novasCells = Array(GRID_SIZE).fill("hidden").map((_, i) =>
      bombPos.has(i) ? "bomb" : reveladas.has(i) ? "gem" : "hidden"
    ) as CellState[];
    setCells(novasCells);
    setResultado("win");
    setJogando(false);
    setEncerrado(true);
  }

  function getCellStyle(state: CellState, idx: number) {
    const isBomb = jogando && !encerrado && bombPos.has(idx);
    if (encerrado && bombPos.has(idx)) {
      return "bg-red-600/80 border-red-500 scale-100";
    }
    if (state === "gem") return "bg-emerald-500/30 border-emerald-400 scale-105";
    if (state === "bomb") return "bg-red-600/80 border-red-500";
    return "bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/30 cursor-pointer active:scale-95";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-white/70 hover:text-white transition">
              ← Voltar
            </button>
            <div>
              <h1 className="text-xl font-bold">💣 Mines</h1>
              <p className="text-sm text-white/60">BetClean Original</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Saldo</p>
            <p className="text-lg font-bold text-amber-400">
              {saldo.toLocaleString("pt-BR")} moedas
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Resultado Banner */}
        {resultado && (
          <div className={`mb-6 rounded-2xl p-4 text-center text-xl font-bold ${
            resultado === "win"
              ? "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300"
              : "bg-red-500/20 border border-red-400/40 text-red-300"
          }`}>
            {resultado === "win"
              ? `🎉 Você ganhou +${ganhoAtual.toLocaleString("pt-BR")} moedas!`
              : "💥 Bomba! Você perdeu esta rodada."}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Grid de Células */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="grid grid-cols-5 gap-2">
              {cells.map((cell, idx) => (
                <button
                  key={idx}
                  onClick={() => revelarCelula(idx)}
                  disabled={!jogando || encerrado || cell !== "hidden"}
                  className={`aspect-square rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-150 select-none ${getCellStyle(cell, idx)}`}
                >
                  {cell === "gem" && "💎"}
                  {cell === "bomb" && "💣"}
                </button>
              ))}
            </div>
          </div>

          {/* Painel de Controle */}
          <div className="space-y-4">
            {/* Stats ao vivo */}
            {jogando && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-sm text-emerald-300 mb-1">💰 Ganho atual</p>
                <p className="text-3xl font-bold text-emerald-300">
                  {ganhoAtual.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-white/60 mt-1">
                  Multiplicador: <span className="text-white font-semibold">{multiplicadorAtual}x</span>
                </p>
                <p className="text-sm text-white/60">
                  Gems: <span className="text-white font-semibold">{reveladas.size}</span>
                </p>
              </div>
            )}

            {/* Config */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
              <h3 className="font-bold">Configurações</h3>

              {/* Aposta */}
              <div>
                <label className="text-sm text-white/60 block mb-2">Aposta</label>
                <div className="grid grid-cols-3 gap-2">
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
                      {v.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bombas */}
              <div>
                <label className="text-sm text-white/60 block mb-2">
                  Bombas: <span className="text-white font-semibold">{bombs}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={bombs}
                  disabled={jogando}
                  onChange={e => setBombs(Number(e.target.value))}
                  className="w-full accent-red-500 disabled:opacity-50"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>1 (fácil)</span>
                  <span>10 (hard)</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              {!jogando ? (
                <button
                  onClick={iniciar}
                  disabled={saldo < aposta}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 font-bold text-black text-lg transition hover:scale-[1.02] disabled:opacity-50"
                >
                  {encerrado ? "🔄 Jogar Novamente" : "🚀 Iniciar Jogo"}
                </button>
              ) : (
                <button
                  onClick={cashout}
                  disabled={reveladas.size === 0}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 font-bold text-white text-lg transition hover:scale-[1.02] disabled:opacity-50"
                >
                  💰 Cash Out ({ganhoAtual.toLocaleString()})
                </button>
              )}
            </div>

            {/* Info */}
            <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4 text-sm text-white/70 space-y-1">
              <p className="font-semibold text-blue-300 mb-2">📖 Como jogar</p>
              <p>• Cada gem revelada aumenta o multiplicador</p>
              <p>• Mais bombas = maior multiplicador</p>
              <p>• Clique em <strong>Cash Out</strong> para garantir seus ganhos</p>
              <p>• Se tocar uma bomba, perde tudo</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
