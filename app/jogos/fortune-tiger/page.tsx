"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import { formatBRL } from "@/lib/currency";

const SYMBOLS = ["🐯", "🪙", "🧨", "🧧", "💠", "BONUS"] as const;

const symbolMeta = {
  "🐯": {
    label: "Tiger",
    accent: "from-amber-200 via-amber-400 to-orange-500",
    ring: "border-amber-300/50",
  },
  "🪙": {
    label: "Coin",
    accent: "from-yellow-100 via-yellow-300 to-amber-500",
    ring: "border-yellow-300/50",
  },
  "🧨": {
    label: "Fire",
    accent: "from-rose-200 via-rose-400 to-red-500",
    ring: "border-rose-300/50",
  },
  "🧧": {
    label: "Lucky",
    accent: "from-red-200 via-red-400 to-fuchsia-500",
    ring: "border-red-300/50",
  },
  "💠": {
    label: "Gem",
    accent: "from-sky-100 via-cyan-300 to-blue-500",
    ring: "border-cyan-300/50",
  },
  BONUS: {
    label: "Bonus",
    accent: "from-emerald-100 via-emerald-300 to-lime-500",
    ring: "border-emerald-300/60",
  },
} satisfies Record<(typeof SYMBOLS)[number], { label: string; accent: string; ring: string }>;

type SymbolType = (typeof SYMBOLS)[number];

type SpinResult = {
  premio: number;
  bonusTriggered: boolean;
  linhasVencedoras: number[];
  contagemBonus: number;
};

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function gerarGrade() {
  return Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => randomSymbol()));
}

function calcularPremio(grade: SymbolType[][], aposta: number, bonusMode: boolean): SpinResult {
  const linhas = [grade[0], grade[1], grade[2]];
  let multiplicador = 0;
  const linhasVencedoras: number[] = [];
  const contagemBonus = grade.flat().filter((item) => item === "BONUS").length;

  linhas.forEach((linha, index) => {
    if (linha[0] === linha[1] && linha[1] === linha[2]) {
      const base = linha[0] === "🐯" ? 14 : linha[0] === "BONUS" ? 18 : 6;
      multiplicador += bonusMode ? base + 4 : base;
      linhasVencedoras.push(index);
    }
  });

  if (contagemBonus >= 3) {
    multiplicador += bonusMode ? 20 : 12;
  }

  return {
    premio: aposta * multiplicador,
    bonusTriggered: contagemBonus >= 3,
    linhasVencedoras,
    contagemBonus,
  };
}

export default function FortuneTigerPage() {
  const router = useRouter();
  const { saldo, setSaldo, registrarResultado } = useDemoWallet();

  const [grade, setGrade] = useState<SymbolType[][]>(gerarGrade);
  const [aposta, setAposta] = useState(40);
  const [girando, setGirando] = useState(false);
  const [ultimoPremio, setUltimoPremio] = useState(0);
  const [mensagem, setMensagem] = useState("Mesa pronta. Bonus ON para 3 símbolos especiais.");
  const [freeSpins, setFreeSpins] = useState(0);
  const [bonusAtivo, setBonusAtivo] = useState(true);
  const [linhasAtivas, setLinhasAtivas] = useState<number[]>([]);
  const [rodadas, setRodadas] = useState(0);
  const [totalGanho, setTotalGanho] = useState(0);
  const [maiorMultiplicador, setMaiorMultiplicador] = useState(0);

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  const emBonus = freeSpins > 0;
  const statusOperacional = useMemo(() => {
    if (girando) return "Spin em processamento";
    if (emBonus) return `${freeSpins} free spins restantes`;
    return "Base game ativo";
  }, [emBonus, freeSpins, girando]);

  function girar() {
    if (girando || saldo < aposta) return;

    setGirando(true);
    setMensagem(emBonus ? "Bonus round em execução..." : "Spin em execução...");
    setLinhasAtivas([]);

    const frameTimer = setInterval(() => {
      setGrade(gerarGrade());
    }, 90);

    setTimeout(() => {
      clearInterval(frameTimer);
      const final = gerarGrade();
      const avaliacao = calcularPremio(final, aposta, bonusAtivo || emBonus);
      const custoRodada = emBonus ? 0 : aposta;
      const freeSpinsAtuais = freeSpins;

      setGrade(final);
      setLinhasAtivas(avaliacao.linhasVencedoras);
      setSaldo((atual) => atual - custoRodada + avaliacao.premio);
      registrarResultado(custoRodada, avaliacao.premio);
      setUltimoPremio(avaliacao.premio);
      setRodadas((atual) => atual + 1);
      setTotalGanho((atual) => atual + avaliacao.premio);
      setMaiorMultiplicador((atual) => Math.max(atual, custoRodada > 0 ? Math.round(avaliacao.premio / custoRodada) : 0));

      if (avaliacao.bonusTriggered) {
        setFreeSpins((atual) => atual + 5);
      }

      if (freeSpinsAtuais > 0) {
        setFreeSpins((atual) => Math.max(atual - 1, 0));
      }

      setMensagem(
        avaliacao.bonusTriggered
          ? `Bonus ON confirmado: +5 free spins e crédito de ${formatBRL(avaliacao.premio)}.`
          : avaliacao.premio > 0
            ? `Linha premiada liquidada em ${formatBRL(avaliacao.premio)}.`
            : emBonus
              ? "Bonus round sem pagamento nesta rodada."
              : "Sem prêmio nesta rodada."
      );
      setGirando(false);
    }, 1300);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(185,28,28,0.18),_transparent_26%),#05070d] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.8fr_0.4fr]">
        <section className="surface-card rounded-[32px] border border-amber-500/20 p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-amber-300">PG Inspired • Fortune Series</p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Fortune Tiger</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/65 sm:text-base">
                Slot autoral com atmosfera oriental premium, leitura mais realista de rolos
                e bonus ON com free spins automáticos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => router.push("/jogos/catalogo")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Voltar ao lobby
              </button>
              <button
                onClick={() => document.documentElement.requestFullscreen?.()}
                className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/15"
              >
                Tela cheia
              </button>
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Carteira</p>
              <p className="mt-2 text-xl font-bold text-emerald-300">{formatBRL(saldo)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Último ganho</p>
              <p className="mt-2 text-xl font-bold text-amber-200">{formatBRL(ultimoPremio)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Modo</p>
              <p className="mt-2 text-xl font-bold text-white">{bonusAtivo ? "Bonus ON" : "Bonus OFF"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Status</p>
              <p className="mt-2 text-sm font-semibold text-cyan-200">{statusOperacional}</p>
            </div>
          </div>

          <div className="rounded-[30px] border border-amber-400/30 bg-[linear-gradient(180deg,rgba(145,31,31,0.92)_0%,rgba(78,15,15,0.95)_100%)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-yellow-300/20 bg-black/25 px-4 py-3 text-sm text-yellow-100/80">
              <span>Golden Reels</span>
              <span>{emBonus ? "Free Spins Ativos" : "Base Game"}</span>
              <span>{bonusAtivo ? "Bonus ON" : "Bonus OFF"}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-[28px] border border-yellow-200/30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_45%),linear-gradient(180deg,#f7df9c_0%,#f3b84e_32%,#6a1d10_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
              {grade.map((linha, i) =>
                linha.map((item, j) => {
                  const meta = symbolMeta[item];
                  const linhaPremiada = linhasAtivas.includes(i);

                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`relative flex h-28 flex-col items-center justify-center overflow-hidden rounded-2xl border bg-[linear-gradient(180deg,rgba(255,248,220,0.98)_0%,rgba(252,228,169,0.98)_100%)] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 sm:h-32 ${
                        linhaPremiada
                          ? "animate-bonus-flare border-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.38)]"
                          : meta.ring
                      } ${girando ? "animate-reel-flicker" : ""}`}
                    >
                      <div className={`absolute inset-x-4 top-0 h-1 rounded-b-full bg-gradient-to-r ${meta.accent} opacity-80`} />
                      <div className="text-5xl sm:text-6xl">{item === "BONUS" ? "🐅" : item}</div>
                      <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-black/70">
                        {meta.label}
                      </span>
                      {item === "BONUS" && (
                        <span className="mt-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                          Bonus
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center text-sm text-yellow-50/90">
              {mensagem}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {[20, 40, 60, 100, 200].map((valor) => (
                <button
                  key={valor}
                  onClick={() => setAposta(valor)}
                  disabled={girando || emBonus}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    aposta === valor
                      ? "pill-brand"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  } disabled:opacity-50`}
                >
                  {formatBRL(valor)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBonusAtivo((atual) => !atual)}
                disabled={girando || emBonus}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  bonusAtivo
                    ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                    : "border-white/10 bg-white/5 text-white"
                } disabled:opacity-50`}
              >
                {bonusAtivo ? "Bonus ON" : "Bonus OFF"}
              </button>
              <button
                onClick={girar}
                disabled={girando || saldo < aposta}
                className="rounded-full bg-[linear-gradient(180deg,#ffe08a_0%,#f3c54f_45%,#c99017_100%)] px-8 py-4 text-lg font-bold text-black shadow-[0_16px_30px_rgba(245,158,11,0.38)] transition hover:scale-[1.02] disabled:opacity-50"
              >
                {girando ? "Girando" : emBonus ? "Free Spin" : "Spin"}
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="surface-card rounded-[30px] border border-white/10 p-5">
            <p className="text-sm text-white/50">Painel de sessão</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Tiger Metrics</h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Rodadas</p>
                <p className="mt-2 text-xl font-bold text-white">{rodadas}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Free Spins</p>
                <p className="mt-2 text-xl font-bold text-emerald-300">{freeSpins}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Total ganho</p>
                <p className="mt-2 text-xl font-bold text-amber-200">{formatBRL(totalGanho)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Maior multi</p>
                <p className="mt-2 text-xl font-bold text-cyan-200">{maiorMultiplicador}x</p>
              </div>
            </div>
          </div>

          <div className="surface-card rounded-[30px] border border-white/10 p-5">
            <p className="text-sm text-white/50">Configuração de bônus</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Bonus ON</h3>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <p>3 símbolos BONUS liberam mais 5 free spins automaticamente.</p>
              <p>Durante o bônus, a rodada não consome aposta e o multiplicador base sobe.</p>
              <p>Linhas de 3 TIGER pagam mais forte e recebem realce dourado na grade.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
