"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function GaneshaGoldPage() {
  return (
    <FortuneSeriesPage
      title="Ganesha Gold"
      shortTitle="Ganesha Fortune"
      mascot="🐘"
      provider="PG Inspired"
      headerAccent="linear-gradient(180deg,rgba(170,102,30,0.88)_0%,rgba(84,45,16,0.98)_100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.2),_transparent_20%),linear-gradient(180deg,rgba(145,76,18,0.94)_0%,rgba(92,41,14,0.98)_100%)]"
      controlAccent="bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_20%),linear-gradient(180deg,rgba(124,58,19,0.96)_0%,rgba(102,44,16,0.98)_100%)]"
      symbolBg="from-yellow-300 via-amber-300 to-orange-300"
      bonusName="Temple Bonus"
      symbols={["🪷", "🪙", "🔔", "💎", "WILD", "BONUS"]}
      labels={{ "🪷": "LOTUS", "🪙": "COIN", "🔔": "BELL", "💎": "GEM", WILD: "WILD", BONUS: "BONUS" }}
    />
  );
}
