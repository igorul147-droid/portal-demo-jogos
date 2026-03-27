"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function MahjongWaysPage() {
  return (
    <FortuneSeriesPage
      title="Mahjong Ways"
      shortTitle="Jade Dynasty"
      mascot="🐉"
      provider="PG Soft"
      bonusName="Dragon Festival"
      headerAccent="linear-gradient(165deg,#082f49 0%,#0f4c81 42%,#0f766e 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.32),_transparent_42%),linear-gradient(180deg,rgba(8,47,73,0.92)_0%,rgba(19,78,74,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(14,116,144,0.28)_0%,rgba(15,76,129,0.5)_100%)]"
      symbolBg="from-cyan-200 via-emerald-300 to-yellow-200"
      symbols={["JADE", "LANTERN", "BAMBOO", "COIN", "BONUS", "WILD"]}
      labels={{
        JADE: "Jade",
        LANTERN: "Lantern",
        BAMBOO: "Bamboo",
        COIN: "Ancient Coin",
        BONUS: "Festival",
        WILD: "Dragon",
      }}
    />
  );
}
