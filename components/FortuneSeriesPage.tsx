"use client";

import { type CSSProperties, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import { formatBRL } from "@/lib/currency";

type FortuneSeriesConfig = {
  title: string;
  shortTitle: string;
  mascot: string;
  visualStyle?: "default" | "fortune-classic" | "fortune-tiger";
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
type GameFamily = "fortune" | "wild" | "myth" | "candy" | "original" | "classic";
type ToneWave = OscillatorType;

type AudioProfile = {
  wavePrimary: ToneWave;
  waveSecondary: ToneWave;
  spinStart: number[];
  win: number[];
  bonus: number[];
  lose: number[];
};

type MotionProfile = {
  idle: number;
  spin: number;
  win: number;
  bonus: number;
  wild: number;
};

const FAMILY_STYLE: Record<
  GameFamily,
  {
    tag: string;
    baseHue: number;
    altHue: number;
    patternVariant: number;
    shapeVariant: number;
    spinTick: number;
    spinStart: number;
    spinGap: number;
    spinSettle: number;
    scaleLeft: number;
    scaleRight: number;
  }
> = {
  fortune: {
    tag: "Fortune Series",
    baseHue: 38,
    altHue: 8,
    patternVariant: 2,
    shapeVariant: 2,
    spinTick: 70,
    spinStart: 520,
    spinGap: 320,
    spinSettle: 340,
    scaleLeft: 3,
    scaleRight: 4,
  },
  wild: {
    tag: "Wild Series",
    baseHue: 24,
    altHue: 44,
    patternVariant: 0,
    shapeVariant: 1,
    spinTick: 68,
    spinStart: 500,
    spinGap: 280,
    spinSettle: 330,
    scaleLeft: 2,
    scaleRight: 4,
  },
  myth: {
    tag: "Mythic Series",
    baseHue: 256,
    altHue: 208,
    patternVariant: 3,
    shapeVariant: 0,
    spinTick: 74,
    spinStart: 560,
    spinGap: 310,
    spinSettle: 360,
    scaleLeft: 3,
    scaleRight: 5,
  },
  candy: {
    tag: "Candy Series",
    baseHue: 320,
    altHue: 190,
    patternVariant: 1,
    shapeVariant: 3,
    spinTick: 62,
    spinStart: 470,
    spinGap: 250,
    spinSettle: 300,
    scaleLeft: 2,
    scaleRight: 3,
  },
  original: {
    tag: "BetClean Originals",
    baseHue: 162,
    altHue: 204,
    patternVariant: 0,
    shapeVariant: 1,
    spinTick: 67,
    spinStart: 500,
    spinGap: 270,
    spinSettle: 320,
    scaleLeft: 2,
    scaleRight: 3,
  },
  classic: {
    tag: "Classic Slots",
    baseHue: 224,
    altHue: 270,
    patternVariant: 3,
    shapeVariant: 0,
    spinTick: 72,
    spinStart: 540,
    spinGap: 300,
    spinSettle: 350,
    scaleLeft: 3,
    scaleRight: 4,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const FAMILY_AUDIO: Record<GameFamily, AudioProfile> = {
  fortune: {
    wavePrimary: "triangle",
    waveSecondary: "sine",
    spinStart: [330, 430, 540],
    win: [480, 680, 920],
    bonus: [700, 920, 1180, 1450],
    lose: [190, 165],
  },
  wild: {
    wavePrimary: "sawtooth",
    waveSecondary: "triangle",
    spinStart: [280, 360, 440],
    win: [420, 560, 760],
    bonus: [620, 810, 1030, 1260],
    lose: [170, 140],
  },
  myth: {
    wavePrimary: "sine",
    waveSecondary: "triangle",
    spinStart: [350, 470, 610],
    win: [500, 730, 980],
    bonus: [760, 980, 1220, 1520],
    lose: [210, 180],
  },
  candy: {
    wavePrimary: "triangle",
    waveSecondary: "square",
    spinStart: [390, 520, 690],
    win: [560, 760, 990],
    bonus: [820, 1050, 1320, 1660],
    lose: [220, 190],
  },
  original: {
    wavePrimary: "square",
    waveSecondary: "triangle",
    spinStart: [300, 390, 510],
    win: [430, 620, 830],
    bonus: [650, 850, 1090, 1350],
    lose: [175, 150],
  },
  classic: {
    wavePrimary: "triangle",
    waveSecondary: "sine",
    spinStart: [320, 420, 530],
    win: [460, 660, 880],
    bonus: [690, 900, 1120, 1390],
    lose: [180, 155],
  },
};

const FAMILY_MOTION: Record<GameFamily, MotionProfile> = {
  fortune: { idle: 0.92, spin: 0.92, win: 0.9, bonus: 0.86, wild: 0.9 },
  wild: { idle: 0.96, spin: 0.86, win: 0.88, bonus: 0.9, wild: 0.84 },
  myth: { idle: 1.08, spin: 1.04, win: 1.02, bonus: 0.96, wild: 1.0 },
  candy: { idle: 0.86, spin: 0.8, win: 0.82, bonus: 0.8, wild: 0.86 },
  original: { idle: 1.0, spin: 0.96, win: 0.95, bonus: 0.92, wild: 0.95 },
  classic: { idle: 1.1, spin: 1.08, win: 1.04, bonus: 1.0, wild: 1.02 },
};

function detectFamily(title: string, shortTitle: string, provider: string, bonusName: string, labels: Record<string, string>): GameFamily {
  const text = `${title} ${shortTitle} ${provider} ${bonusName} ${Object.values(labels).join(" ")}`.toUpperCase();

  if (/(SWEET|CANDY)/.test(text)) return "candy";
  if (/(WILD|WEST|WOLF|BANDITO|BASS|OUTLAW|COWBOY)/.test(text)) return "wild";
  if (/(OLYMPUS|STARLIGHT|BOOK|JOKER|MAHJONG|DRAGON|GANESHA|MYTH|GATE)/.test(text)) return "myth";
  if (/(TURBO|NEON|MINES|TOWER|HI-LO|ORIGINAL|BETCLEAN)/.test(text)) return "original";
  if (/(FORTUNE|TIGER|RABBIT|OX|MOUSE|PIGGY|TREE|LEPRECHAUN|GEM|LUCK)/.test(text)) return "fortune";

  return "classic";
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function pickPattern(variant: number, hueA: number, hueB: number) {
  if (variant === 0) {
    return `repeating-linear-gradient(135deg, hsla(${hueA},88%,74%,0.08) 0 10px, transparent 10px 20px)`;
  }

  if (variant === 1) {
    return `radial-gradient(circle at 18% 22%, hsla(${hueA},90%,78%,0.14) 0 2px, transparent 3px), radial-gradient(circle at 72% 64%, hsla(${hueB},90%,72%,0.12) 0 2px, transparent 3px)`;
  }

  if (variant === 2) {
    return `repeating-radial-gradient(circle at 50% 50%, hsla(${hueA},80%,70%,0.1) 0 8px, transparent 8px 16px)`;
  }

  return `linear-gradient(90deg, hsla(${hueA},80%,74%,0.08) 1px, transparent 1px), linear-gradient(180deg, hsla(${hueB},80%,72%,0.08) 1px, transparent 1px)`;
}

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

function HeroSeal({ monogram, hueA, hueB, gradientId }: { monogram: string; hueA: number; hueB: number; gradientId: string }) {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 drop-shadow-[0_10px_22px_rgba(0,0,0,0.4)]" aria-hidden>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={`hsla(${hueA},95%,90%,1)`} />
          <stop offset="55%" stopColor={`hsla(${hueA},90%,58%,0.95)`} />
          <stop offset="100%" stopColor={`hsla(${hueB},88%,30%,0.96)`} />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill="rgba(15,23,42,0.55)" stroke={`hsla(${hueA},92%,74%,0.5)`} strokeWidth="2" />
      <circle cx="60" cy="60" r="44" fill={`url(#${gradientId})`} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path d="M26 66 C44 48, 76 48, 94 66" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
      <text x="60" y="68" textAnchor="middle" fill="rgba(15,23,42,0.92)" fontSize="30" fontWeight="900" letterSpacing="2">
        {monogram}
      </text>
    </svg>
  );
}

function FortuneClassicSymbol({ symbol }: { symbol: string }) {
  switch (symbol) {
    case "🪙":
      return (
        <>
          <circle cx="48" cy="48" r="21" fill="#facc15" stroke="#fef3c7" strokeWidth="4" />
          <circle cx="48" cy="48" r="12" fill="#f59e0b" opacity="0.45" />
          <path d="M38 40 C44 35, 52 35, 58 40" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 56 C42 61, 54 61, 60 56" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
          <circle cx="43" cy="42" r="3" fill="rgba(255,255,255,0.3)" />
        </>
      );
    case "🧧":
      return (
        <>
          <rect x="28" y="26" width="40" height="44" rx="7" fill="#dc2626" stroke="#fde68a" strokeWidth="3" />
          <rect x="34" y="32" width="28" height="4" rx="2" fill="#fca5a5" />
          <path d="M32 46 H64" stroke="#fde68a" strokeWidth="2" />
          <circle cx="48" cy="56" r="8" fill="#facc15" />
        </>
      );
    case "🍊":
    case "ORANGE":
      return (
        <>
          <circle cx="34" cy="42" r="14" fill="#fb923c" />
          <circle cx="56" cy="42" r="14" fill="#fdba74" />
          <ellipse cx="31" cy="38" rx="4" ry="2" fill="rgba(255,255,255,0.35)" />
          <ellipse cx="53" cy="38" rx="4" ry="2" fill="rgba(255,255,255,0.35)" />
          <path d="M22 48 C24 58, 30 62, 38 64" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <path d="M44 48 C46 58, 52 62, 60 64" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 26 C42 18, 54 18, 60 26" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
          <path d="M30 58 L48 70 L66 58" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
        </>
      );
    case "🍶":
      return (
        <>
          <path d="M40 24 H56 L54 32 H42 Z" fill="#f1f5f9" />
          <path d="M30 34 C32 26, 64 26, 66 34 L62 70 H34 Z" fill="#a78bfa" stroke="#f5d0fe" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="48" cy="42" rx="10" ry="5" fill="#fef3c7" />
          <path d="M38 58 C42 54, 54 54, 58 58" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case "🟣":
      return (
        <>
          <circle cx="48" cy="48" r="18" fill="#7c3aed" stroke="#e9d5ff" strokeWidth="3" />
          <path d="M36 48 H60" stroke="#e9d5ff" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 36 V60" stroke="#e9d5ff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="48" r="6" fill="#c4b5fd" />
        </>
      );
    case "🥕":
      return (
        <>
          <path d="M50 28 L60 34 L46 70 L36 64 Z" fill="#f97316" stroke="#fdba74" strokeWidth="2" strokeLinejoin="round" />
          <path d="M48 27 L44 22 M52 27 L58 22" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          <path d="M44 48 L54 52" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case "🎆":
      return (
        <>
          <circle cx="48" cy="48" r="10" fill="#facc15" />
          <path d="M48 24 V34 M48 62 V72 M24 48 H34 M62 48 H72" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 32 L38 38 M58 58 L64 64 M32 64 L38 58 M58 38 L64 32" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "🥮":
      return (
        <>
          <path d="M24 58 C30 40, 66 40, 72 58 L64 68 H32 Z" fill="#f59e0b" stroke="#fef3c7" strokeWidth="3" strokeLinejoin="round" />
          <path d="M34 50 C40 58, 56 58, 62 50" fill="#fde68a" />
          <path d="M30 62 C36 56, 60 56, 66 62" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="48" cy="58" rx="16" ry="6" fill="#facc15" />
        </>
      );
    case "💎":
      return (
        <>
          <polygon points="48,24 66,40 58,66 38,66 30,40" fill="#38bdf8" stroke="#bae6fd" strokeWidth="3" strokeLinejoin="round" />
          <path d="M38 40 H58 M48 24 V66" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
          <circle cx="53" cy="36" r="3" fill="rgba(255,255,255,0.55)" />
        </>
      );
    case "🍑":
      return (
        <>
          <path d="M48 30 C62 24, 74 38, 66 54 C62 64, 54 70, 48 70 C42 70, 34 64, 30 54 C22 38, 34 24, 48 30 Z" fill="#fb7185" stroke="#fecdd3" strokeWidth="3" />
          <path d="M48 32 V68" stroke="#f43f5e" strokeWidth="2" />
          <path d="M46 24 C50 18, 58 18, 62 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "🍋":
      return (
        <>
          <ellipse cx="48" cy="50" rx="18" ry="14" fill="#facc15" stroke="#fef08a" strokeWidth="3" />
          <path d="M30 50 C36 44, 60 44, 66 50" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 36 C42 30, 54 30, 60 36" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "🍒":
      return (
        <>
          <circle cx="40" cy="56" r="10" fill="#dc2626" />
          <circle cx="56" cy="56" r="10" fill="#b91c1c" />
          <path d="M40 46 C42 34, 48 30, 48 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          <path d="M56 46 C54 34, 48 30, 48 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="37" cy="53" rx="2.5" ry="2" fill="rgba(255,255,255,0.35)" />
        </>
      );
    case "CHARM":
      return (
        <>
          <circle cx="48" cy="36" r="14" fill="#22c55e" stroke="#fef3c7" strokeWidth="4" />
          <circle cx="48" cy="36" r="5" fill="#fef3c7" />
          <path d="M38 28 L58 46" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 50 L40 60 L48 70 L56 60 Z" fill="#ef4444" />
          <path d="M34 54 C42 58, 54 58, 62 54" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case "INGOT":
      return (
        <>
          <path d="M24 58 C30 40, 66 40, 72 58 L64 68 H32 Z" fill="#f59e0b" stroke="#fef3c7" strokeWidth="3" strokeLinejoin="round" />
          <path d="M34 50 C40 58, 56 58, 62 50" fill="#fde68a" />
          <path d="M30 62 C36 56, 60 56, 66 62" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="48" cy="58" rx="16" ry="6" fill="#facc15" />
        </>
      );
    case "ENVELOPE":
      return (
        <>
          <rect x="28" y="28" width="40" height="42" rx="6" fill="#dc2626" stroke="#fde68a" strokeWidth="3" />
          <path d="M28 40 L48 54 L68 40" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinejoin="round" />
          <path d="M28 54 L48 44 L68 54" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="48" cy="48" r="6" fill="#facc15" />
        </>
      );
    case "BAG":
      return (
        <>
          <path d="M34 34 H62 L58 44 H38 Z" fill="#9333ea" />
          <path d="M28 46 C30 34, 66 34, 68 46 L64 70 H32 Z" fill="#7c3aed" stroke="#fef3c7" strokeWidth="3" strokeLinejoin="round" />
          <path d="M34 62 C40 66, 56 66, 62 62" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
          <circle cx="48" cy="56" r="9" fill="#f59e0b" />
          <text x="48" y="60" textAnchor="middle" fill="#7f1d1d" fontSize="10" fontWeight="900">福</text>
        </>
      );
    case "BONUS":
      return (
        <>
          <circle cx="48" cy="48" r="22" fill="#facc15" stroke="#fef3c7" strokeWidth="4" />
          <circle cx="42" cy="40" r="4" fill="rgba(255,255,255,0.35)" />
          <text x="48" y="54" textAnchor="middle" fill="#7f1d1d" fontSize="15" fontWeight="900">BON</text>
        </>
      );
    case "WILD":
      return (
        <>
          <circle cx="48" cy="46" r="20" fill="#f59e0b" stroke="#fef3c7" strokeWidth="4" />
          <circle cx="39" cy="43" r="3" fill="#1f2937" />
          <circle cx="57" cy="43" r="3" fill="#1f2937" />
          <path d="M40 54 C44 58, 52 58, 56 54" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
          <path d="M36 52 C40 49, 56 49, 60 52" fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 32 L38 24 L42 34" fill="#fde68a" />
          <path d="M66 32 L58 24 L54 34" fill="#fde68a" />
        </>
      );
    default:
      return null;
  }
}

function ReelGlyph({
  symbol,
  token,
  label,
  motionClass,
  motionStyle,
}: {
  symbol: string;
  token: string;
  label?: string;
  motionClass?: string;
  motionStyle?: CSSProperties;
}) {
  const isBonus = symbol === "BONUS";
  const isWild = symbol === "WILD";
  const theme = detectTheme(symbol, label);
  const [startColor, endColor] = themeGradient(theme, isBonus, isWild);
  const gradientId = useId();
  const fortuneSymbol = [
    "🪙",
    "🧧",
    "🍊",
    "🍶",
    "🟣",
    "🥕",
    "🎆",
    "🥮",
    "💎",
    "🍑",
    "🍋",
    "🍒",
    "ORANGE",
    "CHARM",
    "INGOT",
    "ENVELOPE",
    "BAG",
    "BONUS",
    "WILD",
  ].includes(symbol);

  return (
    <svg
      viewBox="0 0 96 96"
      className={`h-14 w-14 drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)] ${motionClass ?? ""}`}
      style={motionStyle}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="76" height="76" rx="22" fill={fortuneSymbol ? "rgba(255,248,220,0.58)" : "rgba(15,23,42,0.48)"} stroke="rgba(255,255,255,0.25)" />
      <rect x="17" y="17" width="62" height="62" rx="18" fill={fortuneSymbol ? "rgba(255,251,235,0.94)" : `url(#${gradientId})`} stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
      {fortuneSymbol ? (
        <FortuneClassicSymbol symbol={symbol} />
      ) : (
        <>
          <ThemeMark theme={theme} />
          {isBonus && <circle cx="48" cy="30" r="6" fill="rgba(255,255,255,0.65)" />}
          {isWild && <path d="M24 64 L48 24 L72 64 Z" fill="rgba(255,255,255,0.22)" />}
          <text x="48" y="58" textAnchor="middle" fill="rgba(15,23,42,0.95)" fontSize="24" fontWeight="900" letterSpacing="1.5">
            {token}
          </text>
        </>
      )}
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
  mascot,
  visualStyle = "default",
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
  const [message, setMessage] = useState(`Mesa pronta. ${bonusName} disponível.`);
  const [lastPrize, setLastPrize] = useState(0);
  const [freeSpins, setFreeSpins] = useState(0);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [rounds, setRounds] = useState(0);
  const [, setTotalWon] = useState(0);
  const [bestMultiplier, setBestMultiplier] = useState(0);
  const [rowSpinning, setRowSpinning] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [rowOffset, setRowOffset] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  const bonusRunning = freeSpins > 0;
  const isFortuneClassicStyle = visualStyle === "fortune-tiger" || visualStyle === "fortune-classic";
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

  const family = useMemo(
    () => detectFamily(title, shortTitle, provider, bonusName, labels),
    [bonusName, labels, provider, shortTitle, title]
  );
  const familyStyle = useMemo(() => FAMILY_STYLE[family], [family]);
  const familyAudio = useMemo(() => FAMILY_AUDIO[family], [family]);
  const familyMotion = useMemo(() => FAMILY_MOTION[family], [family]);

  const identity = useMemo(() => {
    const seed = hashSeed(`${title}-${shortTitle}-${provider}`);
    const hueA = (familyStyle.baseHue + (seed % 34)) % 360;
    const hueB = (familyStyle.altHue + (seed % 28)) % 360;

    return {
      seed,
      hueA,
      hueB,
      patternVariant: (familyStyle.patternVariant + (seed % 2)) % 4,
      shapeVariant: (familyStyle.shapeVariant + (seed % 2)) % 4,
      scaleLeft: familyStyle.scaleLeft + (seed % 2),
      scaleRight: familyStyle.scaleRight + (seed % 2),
      spinTick: familyStyle.spinTick + (seed % 8),
      spinStart: familyStyle.spinStart + (seed % 70),
      spinGap: familyStyle.spinGap + (seed % 50),
      spinSettle: familyStyle.spinSettle + (seed % 60),
    };
  }, [familyStyle, provider, shortTitle, title]);

  const heroGradientId = useMemo(() => `hero-core-${identity.seed}`, [identity.seed]);
  const audioIdentity = useMemo(() => {
    const semitoneShift = ((identity.seed % 11) - 5) * 0.35;
    const transpose = Math.pow(2, semitoneShift / 12);
    const tempoFactor = 0.94 + (identity.seed % 9) * 0.015;
    const gainBoost = 0.9 + (identity.seed % 7) * 0.035;

    return {
      transpose,
      tempoFactor,
      gainBoost: clamp(gainBoost, 0.82, 1.16),
    };
  }, [identity.seed]);
  const mainBackground = useMemo(
    () => `radial-gradient(circle at 12% 8%, hsla(${identity.hueA},88%,70%,0.18), transparent 28%), radial-gradient(circle at 88% 86%, hsla(${identity.hueB},82%,62%,0.16), transparent 30%), ${headerAccent}`,
    [headerAccent, identity.hueA, identity.hueB]
  );
  const reelBackground = useMemo(
    () => `linear-gradient(180deg, hsla(${identity.hueA},58%,24%,0.94) 0%, hsla(${identity.hueB},62%,16%,0.96) 100%)`,
    [identity.hueA, identity.hueB]
  );
  const reelPattern = useMemo(
    () => pickPattern(identity.patternVariant, identity.hueA, identity.hueB),
    [identity.hueA, identity.hueB, identity.patternVariant]
  );
  const spinButtonBackground = useMemo(
    () =>
      isFortuneClassicStyle
        ? "linear-gradient(180deg, rgba(34,197,94,1) 0%, rgba(21,128,61,1) 100%)"
        : `linear-gradient(180deg, hsla(${identity.hueA},72%,48%,1) 0%, hsla(${identity.hueB},76%,34%,1) 100%)`,
    [identity.hueA, identity.hueB, isFortuneClassicStyle]
  );
  const cellShapeClass = useMemo(
    () => ["rounded-[22px]", "rounded-[14px]", "rounded-[28px]", "rounded-[10px]"][identity.shapeVariant],
    [identity.shapeVariant]
  );
  const currentStakeIndex = Math.max(BET_OPTIONS.indexOf(stake), 0);
  const canDecreaseStake = !spinning && !bonusRunning && currentStakeIndex > 0;
  const nextStake = BET_OPTIONS[Math.min(currentStakeIndex + 1, BET_OPTIONS.length - 1)];
  const canIncreaseStake = !spinning && !bonusRunning && currentStakeIndex < BET_OPTIONS.length - 1 && saldo >= nextStake;
  const themedRibbonText = useMemo(
    () => (title === "Fortune Tiger" ? "Win up to 2500x!" : `${shortTitle} Lucky Spins`),
    [shortTitle, title]
  );
  const tigerFinalPolish = visualStyle === "fortune-tiger";
  const glyphMotionStyle = useMemo(() => {
    const boost = tigerFinalPolish ? 0.9 : 1;
    return {
      "--glyph-idle-duration": `${(1.8 * familyMotion.idle * boost).toFixed(2)}s`,
      "--glyph-spin-duration": `${(0.22 * familyMotion.spin * boost).toFixed(2)}s`,
      "--glyph-win-duration": `${(0.7 * familyMotion.win * boost).toFixed(2)}s`,
      "--glyph-bonus-duration": `${(0.9 * familyMotion.bonus * boost).toFixed(2)}s`,
      "--glyph-wild-duration": `${(1 * familyMotion.wild * boost).toFixed(2)}s`,
    } as CSSProperties;
  }, [familyMotion, tigerFinalPolish]);

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

  function playToneSequence(
    frequencies: number[],
    length = 0.08,
    waves: { primary: ToneWave; secondary: ToneWave } = {
      primary: familyAudio.wavePrimary,
      secondary: familyAudio.waveSecondary,
    }
  ) {
    const context = getAudioContext();
    if (!context) return;

    const tunedLength = length * audioIdentity.tempoFactor;
    const start = context.currentTime;
    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? waves.primary : waves.secondary;
      const tunedFrequency = clamp(frequency * audioIdentity.transpose, 120, 2200);
      oscillator.frequency.setValueAtTime(tunedFrequency, start + index * tunedLength * 0.9);
      gain.gain.setValueAtTime(0.0001, start + index * tunedLength * 0.9);
      gain.gain.exponentialRampToValueAtTime(0.04 * audioIdentity.gainBoost, start + index * tunedLength * 0.9 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + (index + 1) * tunedLength);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start + index * tunedLength * 0.9);
      oscillator.stop(start + (index + 1) * tunedLength + 0.03);
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

  function setRowOffsetAt(rowIndex: number, value: number) {
    setRowOffset((current) => {
      const next = [...current] as [number, number, number];
      next[rowIndex] = value;
      return next;
    });
  }

  function settleRowMotion(rowIndex: number) {
    [16, -10, 6, -2, 0].forEach((offset, offsetIndex) => {
      window.setTimeout(() => {
        setRowOffsetAt(rowIndex, offset);
      }, offsetIndex * 55);
    });
  }

  function spin() {
    if (spinning || saldo < stake) return;

    setSpinning(true);
    setRowSpinning([true, true, true]);
    setRowOffset([0, 0, 0]);
    setWinningLines([]);
    setMessage(bonusRunning ? "Roleta em bonus: linhas em movimento..." : "Roleta em execução, linha por linha...");
    playToneSequence(familyAudio.spinStart, 0.05);

    const result = makeGrid(symbols);
    const intervals = [0, 1, 2].map((rowIndex) =>
      window.setInterval(() => {
        setGrid((current) => {
          const next = [...current] as string[][];
          next[rowIndex] = makeRow(symbols);
          return next;
        });
        setRowOffsetAt(rowIndex, (Math.random() > 0.5 ? 1 : -1) * (10 + rowIndex * 3 + Math.random() * 10));
      }, identity.spinTick + rowIndex * 11)
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
        settleRowMotion(rowIndex);
      }, identity.spinStart + rowIndex * identity.spinGap);
    });

    window.setTimeout(() => {
      const evaluation = evaluateGrid(result, stake, true);
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
        playToneSequence(familyAudio.bonus, 0.08, {
          primary: familyAudio.waveSecondary,
          secondary: familyAudio.wavePrimary,
        });
      } else if (evaluation.prize > 0) {
        burstParticles(10);
        playToneSequence(familyAudio.win, 0.07);
      } else {
        playToneSequence(familyAudio.lose, 0.05);
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

      setRowOffset([0, 0, 0]);
      setSpinning(false);
    }, identity.spinStart + identity.spinGap * 2 + identity.spinSettle + 220);
  }

  return (
    <main className="min-h-screen px-2 py-3 text-white sm:px-4" style={{ backgroundImage: mainBackground }}>
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-black/25 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          {isFortuneClassicStyle ? (
            <header className="relative overflow-hidden border-b border-yellow-300/20 bg-[linear-gradient(180deg,rgba(127,29,29,0.98)_0%,rgba(153,27,27,0.96)_100%)] px-3 pb-2 pt-2 text-white/85">
              <div className="absolute inset-x-0 top-0 h-10 bg-[radial-gradient(circle_at_top,rgba(254,240,138,0.3),transparent_75%)]" />
              <div className="relative flex items-center justify-between text-[11px] font-bold text-yellow-100/80">
                <span>19:18</span>
                <div className="flex items-center gap-2 uppercase tracking-[0.18em]">
                  <span className="rounded-full border border-yellow-200/30 bg-black/20 px-2 py-0.5">PG</span>
                  <button
                    onClick={() => router.push("/jogos/catalogo")}
                    className="rounded-full border border-yellow-200/30 bg-black/20 px-2 py-0.5"
                  >
                    Lobby
                  </button>
                </div>
              </div>
              <div className="relative mt-2 flex justify-center">
                <div className="h-8 w-[82%] rounded-t-[26px] border border-green-200/35 bg-[linear-gradient(180deg,rgba(34,197,94,0.98)_0%,rgba(22,101,52,0.98)_100%)] shadow-[0_10px_20px_rgba(0,0,0,0.2)]" />
              </div>
            </header>
          ) : (
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
          )}

          <section className={`relative overflow-hidden border-y border-white/10 px-3 pb-3 pt-4 ${stageAccent}`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_70%)]" />
            <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/55">
              <span>{shortTitle}</span>
              <div className="flex items-center gap-2">
                {!isFortuneClassicStyle && (
                  <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[9px] tracking-[0.18em] text-white/75">
                    {familyStyle.tag}
                  </span>
                )}
                <span>{statusText}</span>
              </div>
            </div>

            <div
              className={`relative rounded-[28px] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.25)] ${
                isFortuneClassicStyle ? "border border-yellow-300/35" : "border border-fuchsia-300/20"
              }`}
              style={{
                backgroundImage: isFortuneClassicStyle
                  ? "linear-gradient(180deg,rgba(255,232,181,0.96)_0%,rgba(253,206,121,0.98)_100%)"
                  : reelBackground,
              }}
            >
              <div className="pointer-events-none absolute inset-x-4 top-2 h-10 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_74%)]" />
              <div
                className="pointer-events-none absolute inset-1 rounded-[24px] opacity-70"
                style={{
                  backgroundImage: isFortuneClassicStyle
                    ? "linear-gradient(90deg, rgba(180,83,9,0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(180,83,9,0.12) 1px, transparent 1px)"
                    : reelPattern,
                  backgroundSize: identity.patternVariant === 3 ? "14px 14px" : "auto",
                }}
              />
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
                {isFortuneClassicStyle ? (
                  <div className="relative w-full max-w-[290px] overflow-hidden rounded-[30px] border border-yellow-300/45 bg-[linear-gradient(180deg,rgba(185,28,28,0.96)_0%,rgba(127,29,29,0.98)_100%)] px-5 pb-4 pt-5 text-center shadow-[0_18px_38px_rgba(120,53,15,0.35)]">
                    <div className="absolute left-5 right-5 top-0 h-6 -translate-y-1/2 rounded-[18px] border border-green-200/35 bg-[linear-gradient(180deg,rgba(34,197,94,0.95)_0%,rgba(21,128,61,0.98)_100%)] shadow-[0_10px_20px_rgba(0,0,0,0.2)]" />
                    <div className="absolute inset-x-10 top-5 h-8 rounded-full bg-[radial-gradient(circle,rgba(254,240,138,0.34),transparent_72%)]" />
                    <div className="relative flex items-end justify-center gap-4">
                      <div className="rounded-full border border-yellow-200/40 bg-[radial-gradient(circle_at_top,rgba(254,240,138,0.75),rgba(245,158,11,0.2))] px-4 py-3 text-6xl shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
                        {mascot}
                      </div>
                      <div className="pb-2 text-left">
                        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-yellow-100/80">{provider}</p>
                        <p className="text-2xl font-black text-yellow-100">{title}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200/75">{shortTitle}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] px-5 py-3 text-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center">
                      <HeroSeal monogram={mascotMonogram} hueA={identity.hueA} hueB={identity.hueB} gradientId={heroGradientId} />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[0.12fr_1fr_0.12fr] items-stretch gap-2">
                <div
                  className={`flex flex-col items-center justify-around rounded-[22px] py-3 text-lg font-bold ${
                    isFortuneClassicStyle
                      ? "border border-red-300/25 bg-[linear-gradient(180deg,rgba(185,28,28,0.92)_0%,rgba(127,29,29,0.98)_100%)] text-yellow-100/75"
                      : "border border-fuchsia-300/15 bg-fuchsia-500/10 text-fuchsia-200/55"
                  }`}
                >
                  {tigerFinalPolish
                    ? [1, 2, 3].map((value) => (
                        <span key={`left-${value}`} className="text-xl leading-none text-yellow-100/80">
                          {value}
                        </span>
                      ))
                    : Array.from({ length: 5 }).map((_, index) => <span key={index}>{(index + 1) * identity.scaleLeft}</span>)}
                </div>

                <div className={`grid grid-cols-3 gap-2 ${isFortuneClassicStyle ? "rounded-[24px] border border-red-300/20 bg-[linear-gradient(180deg,rgba(180,83,9,0.18)_0%,rgba(127,29,29,0.12)_100%)] p-2" : ""}`}>
                  {grid.map((row, rowIndex) =>
                    row.map((symbol, colIndex) => {
                      const highlighted = winningLines.includes(rowIndex);
                      const glyphMotionClass = rowSpinning[rowIndex]
                        ? "animate-glyph-spin"
                        : symbol === "BONUS"
                          ? "animate-glyph-bonus"
                          : symbol === "WILD"
                            ? "animate-glyph-wild"
                            : highlighted
                              ? "animate-glyph-win"
                              : "animate-glyph-idle";
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`relative flex h-28 items-center justify-center ${cellShapeClass} border text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all ${
                            isFortuneClassicStyle
                              ? "border-amber-300/45 bg-[linear-gradient(180deg,rgba(255,251,235,0.98)_0%,rgba(254,243,199,0.98)_100%)]"
                              : "border-white/10 bg-[linear-gradient(180deg,rgba(30,41,120,0.96)_0%,rgba(44,25,120,0.96)_100%)]"
                          } ${highlighted ? "animate-bonus-flare border-yellow-300/60 shadow-[0_0_24px_rgba(250,204,21,0.35)]" : ""} ${rowSpinning[rowIndex] ? "animate-reel-flicker" : ""}`}
                          style={{
                            transform: `translateY(${rowOffset[rowIndex]}px) scale(${rowSpinning[rowIndex] ? 1.01 : 1})`,
                            filter: rowSpinning[rowIndex] ? "saturate(1.08)" : "none",
                            transition: rowSpinning[rowIndex]
                              ? "transform 90ms linear, filter 90ms linear"
                              : "transform 200ms cubic-bezier(0.22, 1, 0.36, 1), filter 180ms ease-out",
                          }}
                        >
                          <div className={`absolute inset-x-2 top-0 h-1 rounded-b-full bg-gradient-to-r ${symbolBg} opacity-90`} />
                          <div className="absolute inset-x-3 bottom-2 h-3 rounded-full bg-black/10 blur-sm" />
                          <div>
                            <div className="flex justify-center">
                              <ReelGlyph
                                symbol={symbol}
                                token={symbolToken(symbol, bonusMark)}
                                label={labels[symbol]}
                                motionClass={glyphMotionClass}
                                motionStyle={glyphMotionStyle}
                              />
                            </div>
                            <div className={`mt-2 text-[10px] font-bold uppercase tracking-[0.22em] ${isFortuneClassicStyle ? "text-red-900/70" : "text-white/60"}`}>
                              {labels[symbol] ?? symbol}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div
                  className={`flex flex-col items-center justify-around rounded-[22px] py-3 text-lg font-bold ${
                    isFortuneClassicStyle
                      ? "border border-red-300/25 bg-[linear-gradient(180deg,rgba(185,28,28,0.92)_0%,rgba(127,29,29,0.98)_100%)] text-yellow-100/75"
                      : "border border-fuchsia-300/15 bg-fuchsia-500/10 text-fuchsia-200/55"
                  }`}
                >
                  {tigerFinalPolish
                    ? [1, 2, 3].map((value) => (
                        <span key={`right-${value}`} className="text-xl leading-none text-yellow-100/80">
                          {value}
                        </span>
                      ))
                    : Array.from({ length: 5 }).map((_, index) => <span key={index}>{(index + 1) * identity.scaleRight}</span>)}
                </div>
              </div>

              {isFortuneClassicStyle ? (
                <>
                  <div className="mt-3 rounded-[18px] border border-yellow-300/30 bg-[linear-gradient(180deg,rgba(153,27,27,0.98)_0%,rgba(127,29,29,0.98)_100%)] px-4 py-2 text-center text-lg font-black italic text-emerald-300 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
                    {themedRibbonText}
                  </div>
                  <div className="mt-2 rounded-[20px] border border-emerald-300/30 bg-[linear-gradient(180deg,rgba(20,83,45,0.92)_0%,rgba(22,101,52,0.96)_100%)] px-4 py-3 text-center text-sm font-semibold text-emerald-50 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
                    {message}
                  </div>
                </>
              ) : (
                <div className="mt-3 rounded-[20px] border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-cyan-100 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
                  {message}
                </div>
              )}
            </div>
          </section>

          <section className={`relative overflow-hidden px-3 py-4 ${controlAccent}`}>
            <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_70%)]" />
            {isFortuneClassicStyle ? (
              <>
                <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-yellow-100/75">
                  <div className="rounded-[18px] border border-red-300/25 bg-[linear-gradient(180deg,rgba(127,29,29,0.92)_0%,rgba(153,27,27,0.96)_100%)] px-2 py-3">
                    <p className="text-[10px] text-yellow-100/55">Saldo</p>
                    <p className="mt-1 text-sm text-yellow-50">{formatBRL(saldo)}</p>
                  </div>
                  <div className="rounded-[18px] border border-red-300/25 bg-[linear-gradient(180deg,rgba(127,29,29,0.92)_0%,rgba(153,27,27,0.96)_100%)] px-2 py-3">
                    <p className="text-[10px] text-yellow-100/55">Aposta</p>
                    <p className="mt-1 text-sm text-yellow-50">{formatBRL(stake)}</p>
                  </div>
                  <div className="rounded-[18px] border border-red-300/25 bg-[linear-gradient(180deg,rgba(127,29,29,0.92)_0%,rgba(153,27,27,0.96)_100%)] px-2 py-3">
                    <p className="text-[10px] text-yellow-100/55">Ganho</p>
                    <p className="mt-1 text-sm text-emerald-300">{formatBRL(lastPrize)}</p>
                  </div>
                </div>

                <div className="rounded-[30px] border border-yellow-300/25 bg-[linear-gradient(180deg,rgba(127,29,29,0.94)_0%,rgba(104,22,22,0.98)_100%)] px-3 pb-4 pt-3 shadow-[0_18px_36px_rgba(0,0,0,0.25)]">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-yellow-100/65">
                    <span>{tigerFinalPolish ? "TURBO" : "RAPID"}</span>
                    <span>{tigerFinalPolish ? "AUTO" : "AUTO"}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => {
                          if (currentStakeIndex > 0) {
                            setStake(BET_OPTIONS[currentStakeIndex - 1]);
                          }
                        }}
                        disabled={!canDecreaseStake}
                        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-300/45 bg-[linear-gradient(180deg,rgba(180,83,9,0.28)_0%,rgba(127,29,29,0.16)_100%)] text-3xl font-black text-yellow-200 disabled:opacity-50"
                      >
                        −
                      </button>
                    </div>
                    <div className="min-w-24 rounded-[22px] border border-yellow-300/30 bg-black/20 px-3 py-2 text-center">
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-yellow-100/55">Valor</p>
                      <p className="mt-1 text-lg font-black text-yellow-50">{formatBRL(stake)}</p>
                    </div>
                    <button
                      onClick={spin}
                      disabled={spinning || saldo < stake}
                      className="relative flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-yellow-100/70 text-lg font-black text-yellow-50 shadow-[0_18px_40px_rgba(0,0,0,0.35)] disabled:opacity-50"
                      style={{ backgroundImage: spinButtonBackground }}
                    >
                      <span className="absolute inset-2 rounded-full border border-white/20" />
                      <span className="relative">{spinning ? "..." : "SPIN"}</span>
                    </button>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => {
                          if (currentStakeIndex < BET_OPTIONS.length - 1) {
                            setStake(BET_OPTIONS[currentStakeIndex + 1]);
                          }
                        }}
                        disabled={!canIncreaseStake}
                        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-300/45 bg-[linear-gradient(180deg,rgba(180,83,9,0.28)_0%,rgba(127,29,29,0.16)_100%)] text-3xl font-black text-yellow-200 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
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

                <div className="mb-4 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.36)_0%,rgba(2,6,23,0.44)_100%)] px-3 pb-4 pt-3 shadow-[0_18px_36px_rgba(0,0,0,0.22)]">
                  <div className="mb-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/55">Controle de aposta</div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        if (currentStakeIndex > 0) {
                          setStake(BET_OPTIONS[currentStakeIndex - 1]);
                        }
                      }}
                      disabled={!canDecreaseStake}
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-300/50 bg-yellow-400/10 text-2xl font-bold text-yellow-300 hover:bg-yellow-400/20 disabled:opacity-50"
                    >
                      −
                    </button>
                    <div className="min-w-26 rounded-[22px] border border-white/10 bg-black/25 px-3 py-2 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">Valor</p>
                      <p className="mt-1 text-lg font-black text-white">{formatBRL(stake)}</p>
                    </div>
                    <button
                      onClick={spin}
                      disabled={spinning || saldo < stake}
                      className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-yellow-200/70 text-lg font-black text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] disabled:opacity-50"
                      style={{ backgroundImage: spinButtonBackground }}
                    >
                      {spinning ? "..." : "SPIN"}
                    </button>
                    <button
                      onClick={() => {
                        if (currentStakeIndex < BET_OPTIONS.length - 1) {
                          setStake(BET_OPTIONS[currentStakeIndex + 1]);
                        }
                      }}
                      disabled={!canIncreaseStake}
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-300/50 bg-yellow-400/10 text-2xl font-bold text-yellow-300 hover:bg-yellow-400/20 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => router.push("/")}
                    className="rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white"
                  >
                    Menu
                  </button>
                  <button
                    onClick={() => router.push("/jogos/catalogo")}
                    className="rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white"
                  >
                    Jogos
                  </button>
                </div>
              </>
            )}

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
