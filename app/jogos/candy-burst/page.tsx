"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function CandyBurstPage() {
  return (
    <FortuneSeriesPage
      title="Candy Burst"
      shortTitle="Candy Burst"
      mascot="🍬"
      provider="PG Inspired"
      headerAccent="linear-gradient(180deg,rgba(144,63,196,0.88)_0%,rgba(70,28,117,0.98)_100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.2),_transparent_20%),linear-gradient(180deg,rgba(122,47,179,0.94)_0%,rgba(67,27,129,0.98)_100%)]"
      controlAccent="bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),_transparent_20%),linear-gradient(180deg,rgba(101,32,146,0.96)_0%,rgba(63,24,110,0.98)_100%)]"
      symbolBg="from-pink-300 via-fuchsia-300 to-cyan-300"
      bonusName="Candy Bonus"
      symbols={["🍬", "🍭", "🧁", "🍰", "WILD", "BONUS"]}
      labels={{ "🍬": "CANDY", "🍭": "LOLLY", "🧁": "CUPCAKE", "🍰": "CAKE", WILD: "WILD", BONUS: "BONUS" }}
    />
  );
}
