"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function PiggyGoldPage() {
  return (
    <FortuneSeriesPage
      title="Piggy Gold"
      shortTitle="Piggy Fortune"
      mascot="🐷"
      provider="PG Inspired"
      headerAccent="linear-gradient(180deg,rgba(173,49,105,0.88)_0%,rgba(110,23,58,0.98)_100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.18),_transparent_20%),linear-gradient(180deg,rgba(198,64,116,0.92)_0%,rgba(132,33,65,0.97)_100%)]"
      controlAccent="bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_20%),linear-gradient(180deg,rgba(167,37,68,0.96)_0%,rgba(110,25,48,0.98)_100%)]"
      symbolBg="from-yellow-300 via-pink-300 to-rose-300"
      bonusName="Piggy Bonus"
      symbols={["🪙", "💰", "🍀", "⭐", "WILD", "BONUS"]}
      labels={{ "🪙": "COIN", "💰": "GOLD", "🍀": "LUCK", "⭐": "STAR", WILD: "WILD", BONUS: "BONUS" }}
    />
  );
}
