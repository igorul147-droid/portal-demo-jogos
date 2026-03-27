"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function TreeOfFortunePage() {
  return (
    <FortuneSeriesPage
      title="Tree of Fortune"
      shortTitle="Fortune Tree"
      mascot="🌳"
      provider="PG Inspired"
      headerAccent="linear-gradient(180deg,rgba(41,134,84,0.88)_0%,rgba(20,66,43,0.98)_100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.2),_transparent_20%),linear-gradient(180deg,rgba(25,101,66,0.94)_0%,rgba(18,67,52,0.98)_100%)]"
      controlAccent="bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.18),_transparent_20%),linear-gradient(180deg,rgba(22,78,54,0.96)_0%,rgba(17,59,47,0.98)_100%)]"
      symbolBg="from-emerald-300 via-lime-300 to-yellow-300"
      bonusName="Harvest Bonus"
      symbols={["🍑", "🍊", "🍋", "🍒", "WILD", "BONUS"]}
      labels={{ "🍑": "PEACH", "🍊": "ORANGE", "🍋": "LEMON", "🍒": "CHERRY", WILD: "WILD", BONUS: "BONUS" }}
    />
  );
}
