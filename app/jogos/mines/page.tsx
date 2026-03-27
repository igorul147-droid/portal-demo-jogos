"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function MinesPage() {
  return (
    <FortuneSeriesPage
      title="Mines"
      shortTitle="Gem Grid"
      mascot="💣"
      provider="BetClean Originals"
      bonusName="Mine Sweep"
      headerAccent="linear-gradient(165deg,#052e16 0%,#065f46 42%,#0f766e 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.34),_transparent_42%),linear-gradient(180deg,rgba(6,78,59,0.94)_0%,rgba(20,83,45,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(16,185,129,0.3)_0%,rgba(6,95,70,0.52)_100%)]"
      symbolBg="from-emerald-200 via-teal-300 to-cyan-300"
      symbols={["GEM", "MAP", "RADAR", "SAFE", "BONUS", "WILD"]}
      labels={{
        GEM: "Gem",
        MAP: "Map",
        RADAR: "Radar",
        SAFE: "Safe",
        BONUS: "Sweep",
        WILD: "Defuse",
      }}
    />
  );
}
