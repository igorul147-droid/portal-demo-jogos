"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import { formatBRL } from "@/lib/currency";

type FortuneSeriesConfig = {
  title: string;
  shortTitle: string;
  mascot: string;
  headerAccent: string;
  stageAccent: string;
  controlAccent: string;
  symbolBg: string;
  symbols: string[];
  labels: Record<string, string>;
  bonusName: string;
  provider: string;
};

type Particle = {
  id: number;
  left: string;
  delay: string;
  duration: string;
};

const BET_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 8, 10, 15];

type IconTheme = "coin" | "gem" | "crown" | "lucky" | "animal" | "weapon" | "card" | "special";

function symbolToken(symbol: string, bonusMark: string) {
  if (symbol === "BONUS") return bonusMark;
  if (symbol === "WILD") return "WD";
  return symbol.slice(0, 2).toUpperCase();
}

function detectTheme(symbol: string, label?: string): IconTheme {
  const value = `${symbol} ${label ?? ""}`.toUpperCase();

  if (symbol === "BONUS" || symbol === "WILD") return "special";
  if (/(COIN|VAULT|GOLD|CHEST|POT|FORTUNE)/.test(value)) return "coin";
  if (/(GEM|RUBY|SAPPHIRE|CRYSTAL|RELIC|JADE)/.test(value)) return "gem";
  if (/(CROWN|KING|QUEEN|ACE|JOKER|ROYAL|CARD)/.test(value)) return "card";
  if (/(DRAGON|TIGER|WOLF|OX|RABBIT|MOUSE|GANESHA|LION|EAGLE)/.test(value)) return "animal";
  if (/(WAND|RUNE|SIGIL|MAP|LANTERN|TREE|ARC|NOVA|STEP)/.test(value)) return "lucky";
  if (/(REVOLVER|GUITAR|JET|ALT|WING|THRUST|ROD|FIRE|HAT)/.test(value)) return "weapon";
  return "crown";
}

function themeGradient(theme: IconTheme, isBonus: boolean, isWild: boolean) {
  if (isBonus) return ["rgba(250,204,21,0.96)", "rgba(180,83,9,0.96)"] as const;
  if (isWild) return ["rgba(134,239,172,0.96)", "rgba(21,128,61,0.96)"] as const;

  switch (theme) {
    case "coin":
      return ["rgba(253,224,71,0.95)", "rgba(217,119,6,0.95)"] as const;
    case "gem":
      return ["rgba(125,211,252,0.95)", "rgba(59,130,246,0.95)"] as const;
    case "card":
      return ["rgba(216,180,254,0.95)", "rgba(124,58,237,0.95)"] as const;
    case "animal":
      return ["rgba(251,146,60,0.95)", "rgba(239,68,68,0.95)"] as const;
    case "lucky":
      return ["rgba(110,231,183,0.95)", "rgba(16,185,129,0.95)"] as const;
    case "weapon":
      return ["rgba(148,163,184,0.95)", "rgba(71,85,105,0.95)"] as const;
    default:
      return ["rgba(196,181,253,0.95)", "rgba(99,102,241,0.95)"] as const;
  }
}

function ThemeMark({ theme }: { theme: IconTheme }) {
  switch (theme) {
    case "coin":
      return <circle cx="48" cy="48" r="14" fill="rgba(255,255,255,0.22)" />;
    case "gem":
      return <polygon points="48,24 66,42 48,72 30,42" fill="rgba(255,255,255,0.22)" />;
    case "card":
      return <rect x="34" y="28" width="28" height="40" rx="6" fill="rgba(255,255,255,0.2)" />;
    case "animal":
      return <path d="M26 60 C32 38, 64 38, 70 60 C64 70, 32 70, 26 60 Z" fill="rgba(255,255,255,0.2)" />;
    case "lucky":
      return <path d="M48 24 L56 40 L74 42 L60 54 L64 72 L48 63 L32 72 L36 54 L22 42 L40 40 Z" fill="rgba(255,255,255,0.2)" />;
    case "weapon":
      return <path d="M26 58 L70 38 L74 48 L30 68 Z" fill="rgba(255,255,255,0.2)" />;
    default:
      return <circle cx="48" cy="48" r="16" fill="rgba(255,255,255,0.2)" />;
  }
}

function HeroSeal({ monogram }: { monogram: string }) {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 drop-shadow-[0_10px_22px_rgba(0,0,0,0.4)]" aria-hidden>
      <defs>
        <radialGradient id="hero-core" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="rgba(254,243,199,1)" />
          <stop offset="55%" stopColor="rgba(245,158,11,0.9)" />
          <stop offset="100%" stopColor="rgba(120,53,15,0.95)" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill="rgba(15,23,42,0.55)" stroke="rgba(253,224,71,0.45)" strokeWidth="2" />
      <circle cx="60" cy="60" r="44" fill="url(#hero-core)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path d="M26 66 C44 48, 76 48, 94 66" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
      <text x="60" y="68" textAnchor="middle" fill="rgba(15,23,42,0.92)" fontSize="30" fontWeight="900" letterSpacing="2">
        {monogram}
      </text>
    </svg>
  );
}

function ReelGlyph({ symbol, token, label }: { symbol: string; token: string; label?: string }) {
  const isBonus = symbol === "BONUS";
  const isWild = symbol === "WILD";
  const theme = detectTheme(symbol, label);
  const [startColor, endColor] = themeGradient(theme, isBonus, isWild);

  return (
    <svg viewBox="0 0 96 96" className="h-14 w-14 drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]" aria-hidden>
      <defs>
        <linearGradient id="glyph-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="76" height="76" rx="22" fill="rgba(15,23,42,0.48)" stroke="rgba(255,255,255,0.25)" />
      <rect x="17" y="17" width="62" height="62" rx="18" fill="url(#glyph-bg)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
      <ThemeMark theme={theme} />
      {isBonus && <circle cx="48" cy="30" r="6" fill="rgba(255,255,255,0.65)" />}
      {isWild && <path d="M24 64 L48 24 L72 64 Z" fill="rgba(255,255,255,0.22)" />}
      <text x="48" y="58" textAnchor="middle" fill="rgba(15,23,42,0.95)" fontSize="24" fontWeight="900" letterSpacing="1.5">
        {token}
      </text>
    </svg>
  );
}

function pickRandom(symbols: string[]) {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function makeGrid(symbols: string[]) {
  return Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => pickRandom(symbols)));
}

function makeRow(symbols: string[]) {
  return Array.from({ length: 3 }, () => pickRandom(symbols));
}

function evaluateGrid(grid: string[][], stake: number, bonusBoost: boolean) {
  const rows = [grid[0], grid[1], grid[2]];
  const lines: number[] = [];
  let multiplier = 0;
  const bonusCount = grid.flat().filter((item) => item === "BONUS").length;
  let crossTriggered = false;

  rows.forEach((row, index) => {
    if (row[0] === row[1] && row[1] === row[2]) {
      multiplier += row[0] === "WILD" ? 16 : row[0] === "BONUS" ? 12 : 6;
      lines.push(index);
    }
  });

  const center = grid[1][1];
  if (
    center === grid[0][1] &&
    center === grid[2][1] &&
    center === grid[1][0] &&
    center === grid[1][2]
  ) {
    crossTriggered = true;
    multiplier += center === "WILD" ? 22 : center === "BONUS" ? 18 : 12;
    lines.push(0, 1, 2);
  }

  if (bonusCount >= 3) {
    multiplier += bonusBoost ? 18 : 10;
  }

  if (bonusBoost && multiplier > 0) {
    multiplier += 3;
  }

  return {
    prize: stake * multiplier,
    lines: Array.from(new Set(lines)),
    bonusCount,
    bonusTriggered: bonusCount >= 3,
    multiplier,
    crossTriggered,
  };
}

export default function FortuneSeriesPage({
  title,
  shortTitle,
  mascot: _mascot,
  headerAccent,
  stageAccent,
  controlAccent,
  symbolBg,
  symbols,
  labels,
  bonusName,
  provider,
}: FortuneSeriesConfig) {
  const router = useRouter();
  const { saldo, setSaldo, registrarResultado } = useDemoWallet();
  const audioContextRef = useRef<AudioContext | null>(null);
  const particleIdRef = useRef(0);

  const [grid, setGrid] = useState<string[][]>(() => makeGrid(symbols));
  const [stake, setStake] = useState(0.5);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState(`Mesa pronta. ${bonusName} ON.`);
  const [lastPrize, setLastPrize] = useState(0);
  const [freeSpins, setFreeSpins] = useState(0);
  const [bonusEnabled, setBonusEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [rounds, setRounds] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [bestMultiplier, setBestMultiplier] = useState(0);
  const [rowSpinning, setRowSpinning] = useState<[boolean, boolean, boolean]>([false, false, false]);

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  const bonusRunning = freeSpins > 0;
  const mascotMonogram = useMemo(() => {
    const parts = shortTitle
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

    return parts || "GX";
  }, [shortTitle]);

  const bonusMark = useMemo(() => {
    return bonusName
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "BN";
  }, [bonusName]);

  const statusText = useMemo(() => {
    if (spinning) return "Spin em execução";
    if (bonusRunning) return `${freeSpins} free spins restantes`;
    return `${bonusName} pronto`;
  }, [bonusName, bonusRunning, freeSpins, spinning]);

  function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!audioContextRef.current) {
      const Ctx = window.AudioContext;
      if (!Ctx) return null;
      audioContextRef.current = new Ctx();
    }
    return audioContextRef.current;
  }

  function playToneSequence(frequencies: number[], length = 0.08) {
    if (!audioEnabled) return;
    const context = getAudioContext();
    if (!context) return;

    const start = context.currentTime;
    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start + index * length * 0.9);
      gain.gain.setValueAtTime(0.0001, start + index * length * 0.9);
      gain.gain.exponentialRampToValueAtTime(0.04, start + index * length * 0.9 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + (index + 1) * length);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start + index * length * 0.9);
      oscillator.stop(start + (index + 1) * length + 0.03);
    });
  }

  function burstParticles(count: number) {
    const next = Array.from({ length: count }, () => ({
      id: particleIdRef.current++,
      left: `${10 + Math.random() * 80}%`,
      delay: `${Math.random() * 0.2}s`,
      duration: `${1 + Math.random() * 0.8}s`,
    }));

    setParticles((current) => [...current, ...next]);
    window.setTimeout(() => {
      setParticles((current) => current.filter((item) => !next.some((entry) => entry.id === item.id)));
    }, 2000);
  }

  function spin() {
    if (spinning || saldo < stake) return;

    setSpinning(true);
    setRowSpinning([true, true, true]);
    setWinningLines([]);
    setMessage(bonusRunning ? "Roleta em bonus: linhas em movimento..." : "Roleta em execução, linha por linha...");
    playToneSequence([320, 420, 520], 0.05);

    const result = makeGrid(symbols);
    const intervals = [0, 1, 2].map((rowIndex) =>
      window.setInterval(() => {
        setGrid((current) => {
          const next = [...current] as string[][];
          next[rowIndex] = makeRow(symbols);
          return next;
        });
      }, 75 + rowIndex * 10)
    );

    [0, 1, 2].forEach((rowIndex) => {
      window.setTimeout(() => {
        window.clearInterval(intervals[rowIndex]);
        setGrid((current) => {
          const next = [...current] as string[][];
          next[rowIndex] = result[rowIndex];
          return next;
        });
        setRowSpinning((current) => {
          const next = [...current] as [boolean, boolean, boolean];
          next[rowIndex] = false;
          return next;
        });
      }, 550 + rowIndex * 350);
    });

    window.setTimeout(() => {
      const evaluation = evaluateGrid(result, stake, bonusEnabled || bonusRunning);
      const cost = bonusRunning ? 0 : stake;
      const existingFreeSpins = freeSpins;

      setGrid(result);
      setWinningLines(evaluation.lines);
      setSaldo((current) => current - cost + evaluation.prize);
      registrarResultado(cost, evaluation.prize);
      setLastPrize(evaluation.prize);
      setRounds((current) => current + 1);
      setTotalWon((current) => current + evaluation.prize);
      setBestMultiplier((current) => Math.max(current, evaluation.multiplier));

      if (evaluation.bonusTriggered) {
        setFreeSpins((current) => current + 5);
        burstParticles(18);
        playToneSequence([660, 880, 1100, 1320], 0.08);
      } else if (evaluation.prize > 0) {
        burstParticles(10);
        playToneSequence([460, 680, 860], 0.07);
      } else {
        playToneSequence([180, 160], 0.05);
      }

      if (existingFreeSpins > 0) {
        setFreeSpins((current) => Math.max(current - 1, 0));
      }

      setMessage(
        evaluation.bonusTriggered
          ? `${bonusName} ativado: +5 free spins e ${formatBRL(evaluation.prize)}.`
          : evaluation.crossTriggered
            ? `Cruz perpendicular confirmada. Pagamento de ${formatBRL(evaluation.prize)}.`
            : evaluation.prize > 0
              ? `Fileira de 3 confirmada com ${formatBRL(evaluation.prize)}.`
              : bonusRunning
                ? "Bonus round sem pagamento nesta rodada."
                : "Sem prêmio nesta rodada."
      );

      setSpinning(false);
    }, 1650);
  }

  return (
    <main className={`min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_20%),${headerAccent}] px-2 py-3 text-white sm:px-4`}>
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-black/25 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <header className="flex items-center justify-between px-3 py-2 text-sm text-white/85">
            <div>
              <p className="text-lg font-semibold leading-none">{title}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/45">{provider}</p>
            </div>
            <button
              onClick={() => router.push("/jogos/catalogo")}
              className="rounded-full border border-white/15 bg-black/35 px-3 py-1 font-semibold"
            >
              Lobby
            </button>
          </header>

          <section className={`relative overflow-hidden border-y border-white/10 px-3 pb-3 pt-4 ${stageAccent}`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_70%)]" />
            <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/55">
              <span>{shortTitle}</span>
              <span>{statusText}</span>
            </div>

            <div className="relative rounded-[28px] border border-fuchsia-300/20 bg-[linear-gradient(180deg,rgba(80,23,122,0.92)_0%,rgba(28,19,96,0.94)_100%)] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
                {particles.map((particle) => (
                  <span
                    key={particle.id}
                    className="fortune-particle fortune-particle-gold"
                    style={{ left: particle.left, animationDelay: particle.delay, animationDuration: particle.duration, width: "10px", height: "10px" }}
                  />
                ))}
              </div>

              <div className="mb-3 flex justify-center">
                <div className="rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] px-5 py-3 text-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center">
                    <HeroSeal monogram={mascotMonogram} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[0.12fr_1fr_0.12fr] items-stretch gap-2">
                <div className="flex flex-col items-center justify-around rounded-[22px] border border-fuchsia-300/15 bg-fuchsia-500/10 py-3 text-lg font-bold text-fuchsia-200/55">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index}>{(index + 1) * 2}</span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {grid.map((row, rowIndex) =>
                    row.map((symbol, colIndex) => {
                      const highlighted = winningLines.includes(rowIndex);
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`relative flex h-28 items-center justify-center rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,41,120,0.96)_0%,rgba(44,25,120,0.96)_100%)] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all ${highlighted ? "animate-bonus-flare border-yellow-300/60 shadow-[0_0_24px_rgba(250,204,21,0.35)]" : ""} ${rowSpinning[rowIndex] ? "animate-reel-flicker" : ""}`}
                        >
                          <div className={`absolute inset-x-2 top-0 h-1 rounded-b-full bg-gradient-to-r ${symbolBg} opacity-90`} />
                          <div>
                            <div className="flex justify-center">
                              <ReelGlyph symbol={symbol} token={symbolToken(symbol, bonusMark)} label={labels[symbol]} />
                            </div>
                            <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
                              {labels[symbol] ?? symbol}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex flex-col items-center justify-around rounded-[22px] border border-fuchsia-300/15 bg-fuchsia-500/10 py-3 text-lg font-bold text-fuchsia-200/55">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index}>{(index + 1) * 3}</span>
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-[20px] border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-cyan-100 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
                {message}
              </div>
            </div>
          </section>

          <section className={`relative overflow-hidden px-3 py-4 ${controlAccent}`}>
            <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_70%)]" />
            <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-2xl border border-yellow-300/20 bg-black/25 p-3">
                <p className="text-white/55">Carteira</p>
                <p className="mt-1 font-semibold text-white">{formatBRL(saldo)}</p>
              </div>
              <div className="rounded-2xl border border-yellow-300/20 bg-black/25 p-3">
                <p className="text-white/55">Aposta</p>
                <p className="mt-1 font-semibold text-white">{formatBRL(stake)}</p>
              </div>
              <div className="rounded-2xl border border-yellow-300/20 bg-black/25 p-3">
                <p className="text-white/55">Último ganho</p>
                <p className="mt-1 font-semibold text-emerald-300">{formatBRL(lastPrize)}</p>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-center gap-2">
              {BET_OPTIONS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setStake(amount)}
                  disabled={spinning || bonusRunning}
                  className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                    stake === amount
                      ? "bg-yellow-400 text-black"
                      : "border border-white/10 bg-black/20 text-white"
                  } disabled:opacity-50`}
                >
                  {formatBRL(amount)}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setAudioEnabled((current) => !current)}
                className={`h-12 w-12 rounded-full border border-yellow-300/30 text-xs font-bold ${audioEnabled ? "bg-yellow-300/15 text-yellow-100" : "bg-black/20 text-white/60"}`}
              >
                {audioEnabled ? "AUDIO" : "MUTE"}
              </button>
              <button
                onClick={() => setBonusEnabled((current) => !current)}
                disabled={spinning || bonusRunning}
                className={`h-12 w-12 rounded-full border border-yellow-300/30 text-xs font-bold ${bonusEnabled ? "bg-emerald-400/15 text-emerald-200" : "bg-black/20 text-white/60"} disabled:opacity-50`}
              >
                BONUS
              </button>
              <button
                onClick={spin}
                disabled={spinning || saldo < stake}
                className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-yellow-200/70 bg-[linear-gradient(180deg,#38b26e_0%,#0f8f4d_100%)] text-lg font-black text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] disabled:opacity-50"
              >
                {spinning ? "..." : "SPIN"}
              </button>
              <button
                onClick={() => document.documentElement.requestFullscreen?.()}
                className="h-12 w-12 rounded-full border border-yellow-300/30 bg-black/20 text-xs font-bold text-white/70"
              >
                FULL
              </button>
              <button
                onClick={() => router.push("/jogos/catalogo")}
                className="h-12 w-12 rounded-full border border-yellow-300/30 bg-black/20 text-xs font-bold text-white/70"
              >
                HOME
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-white/65">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p>Rodadas</p>
                <p className="mt-1 text-sm font-semibold text-white">{rounds}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p>Free Spins</p>
                <p className="mt-1 text-sm font-semibold text-emerald-300">{freeSpins}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p>Maior multi</p>
                <p className="mt-1 text-sm font-semibold text-yellow-200">{bestMultiplier}x</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
