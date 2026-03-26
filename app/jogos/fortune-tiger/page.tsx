"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import { formatBRL } from "@/lib/currency";

const SYMBOLS = ["🐯", "🪙", "🧨", "🧧", "💠"];

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function gerarGrade() {
  return Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => randomSymbol()));
}

function calcularPremio(grade: string[][], aposta: number) {
  const linhas = [grade[0], grade[1], grade[2]];
  let multiplicador = 0;

  for (const linha of linhas) {
    if (linha[0] === linha[1] && linha[1] === linha[2]) {
      multiplicador += linha[0] === "🐯" ? 12 : 5;
    }
  }

  return aposta * multiplicador;
}

export default function FortuneTigerPage() {
  const router = useRouter();
  const { saldo, setSaldo, registrarResultado } = useDemoWallet();

  const [grade, setGrade] = useState<string[][]>(gerarGrade);
  const [aposta, setAposta] = useState(40);
  const [girando, setGirando] = useState(false);
  const [ultimoPremio, setUltimoPremio] = useState(0);
  const [mensagem, setMensagem] = useState("Toque para girar");

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  function girar() {
    if (girando || saldo < aposta) return;

    setGirando(true);
    setMensagem("Girando...");

    const frameTimer = setInterval(() => {
      setGrade(gerarGrade());
    }, 90);

    setTimeout(() => {
      clearInterval(frameTimer);
      const final = gerarGrade();
      const premio = calcularPremio(final, aposta);

      setGrade(final);
      setSaldo((atual) => atual - aposta + premio);
      registrarResultado(aposta, premio);
      setUltimoPremio(premio);
      setMensagem(premio > 0 ? `Voce ganhou ${formatBRL(premio)}` : "Sem premio nesta rodada");
      setGirando(false);
    }, 1300);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-red-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col border-x border-yellow-500/30 bg-gradient-to-b from-red-700/30 via-red-800/30 to-red-950/70">
        <header className="flex items-center justify-between px-3 py-2 text-sm">
          <button
            onClick={() => router.push("/jogos/catalogo")}
            className="rounded-full border border-yellow-400/40 bg-black/35 px-3 py-1 font-semibold"
          >
            Lobby
          </button>
          <h1 className="font-bold text-yellow-200">Fortune Tiger</h1>
          <p className="text-yellow-100/80">{new Date().toLocaleTimeString("pt-BR")}</p>
        </header>

        <section className="px-4 pb-3 pt-1">
          <div className="rounded-[28px] border-4 border-yellow-500/70 bg-gradient-to-b from-red-700 to-red-900 p-3 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <div className="mb-3 rounded-2xl border border-yellow-300/30 bg-black/30 p-2 text-center">
              <p className="text-xs uppercase tracking-wider text-yellow-200/80">Saldo</p>
              <p className="text-lg font-bold text-emerald-300">{formatBRL(saldo)}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-yellow-300/35 bg-amber-50 p-2 text-5xl text-black">
              {grade.map((linha, i) =>
                linha.map((item, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`flex h-24 items-center justify-center rounded-xl border border-yellow-400/40 bg-orange-100 ${
                      j === 1 ? "bg-red-200/90" : ""
                    }`}
                  >
                    {item}
                  </div>
                ))
              )}
            </div>

            <p className="mt-3 text-center text-sm text-yellow-100">{mensagem}</p>
          </div>
        </section>

        <section className="mt-auto rounded-t-3xl border-t-2 border-yellow-500/45 bg-gradient-to-b from-red-700 to-red-900 px-4 py-4">
          <div className="mb-3 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl bg-black/30 p-2">
              <p className="text-yellow-100/75">Ultimo ganho</p>
              <p className="font-semibold text-emerald-300">{formatBRL(ultimoPremio)}</p>
            </div>
            <div className="rounded-xl bg-black/30 p-2">
              <p className="text-yellow-100/75">Aposta</p>
              <p className="font-semibold">{formatBRL(aposta)}</p>
            </div>
            <div className="rounded-xl bg-black/30 p-2">
              <p className="text-yellow-100/75">Status</p>
              <p className="font-semibold">{girando ? "Girando" : "Pronto"}</p>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-center gap-2">
            {[20, 40, 60, 100].map((valor) => (
              <button
                key={valor}
                onClick={() => setAposta(valor)}
                disabled={girando}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  aposta === valor ? "bg-yellow-400 text-black" : "bg-black/30 text-white"
                }`}
              >
                {formatBRL(valor)}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-5">
            <button className="h-12 w-12 rounded-full border-2 border-yellow-400/50 bg-black/35 text-lg">⚡</button>
            <button
              onClick={girar}
              disabled={girando || saldo < aposta}
              className="h-24 w-24 rounded-full border-4 border-yellow-300 bg-gradient-to-b from-emerald-400 to-emerald-600 text-2xl font-bold text-black shadow-lg disabled:opacity-50"
            >
              ⟳
            </button>
            <button
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="h-12 w-12 rounded-full border-2 border-yellow-400/50 bg-black/35 text-lg"
            >
              ⛶
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
