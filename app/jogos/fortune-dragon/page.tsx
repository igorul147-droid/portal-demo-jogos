"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function FortuneDragonPage() {
  return (
    <FortuneSeriesPage
      title="Fortune Dragon"
      shortTitle="Dragon Fortune"
      mascot="🐲"
      visualStyle="fortune-classic"
      provider="PG Inspired"
      headerAccent="linear-gradient(180deg,rgba(164,55,185,0.88)_0%,rgba(62,22,101,0.98)_100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_20%),linear-gradient(180deg,rgba(111,35,177,0.92)_0%,rgba(55,23,120,0.96)_100%)]"
      controlAccent="bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_20%),linear-gradient(180deg,rgba(152,36,106,0.96)_0%,rgba(103,23,71,0.98)_100%)]"
      symbolBg="from-fuchsia-300 via-cyan-300 to-yellow-300"
      bonusName="Dragon Bonus"
      symbols={["🪙", "🍶", "🧧", "🟣", "WILD", "BONUS"]}
      labels={{ "🪙": "COIN", "🍶": "DRUM", "🧧": "PACKET", "🟣": "KNOT", WILD: "WILD", BONUS: "BONUS" }}
    />
  );
}
