"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function FortuneMousePage() {
  return (
    <FortuneSeriesPage
      title="Fortune Mouse"
      shortTitle="Mouse Fortune"
      mascot="🐭"
      visualStyle="fortune-classic"
      provider="PG Inspired"
      headerAccent="linear-gradient(180deg,rgba(122,36,90,0.88)_0%,rgba(71,18,54,0.98)_100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_20%),linear-gradient(180deg,rgba(124,39,89,0.92)_0%,rgba(70,22,73,0.97)_100%)]"
      controlAccent="bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.16),_transparent_20%),linear-gradient(180deg,rgba(135,26,79,0.96)_0%,rgba(88,19,51,0.98)_100%)]"
      symbolBg="from-pink-300 via-amber-300 to-yellow-300"
      bonusName="Mouse Bonus"
      symbols={["🪙", "🧧", "🍊", "💎", "WILD", "BONUS"]}
      labels={{ "🪙": "COIN", "🧧": "PACKET", "🍊": "ORANGE", "💎": "GEM", WILD: "WILD", BONUS: "BONUS" }}
    />
  );
}
