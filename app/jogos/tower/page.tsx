"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function TowerPage() {
  return (
    <FortuneSeriesPage
      title="Tower"
      shortTitle="Sky Climb"
      mascot="⬆️"
      provider="BetClean Originals"
      bonusName="Summit Route"
      headerAccent="linear-gradient(165deg,#1e1b4b 0%,#3730a3 42%,#0f766e 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.34),_transparent_42%),linear-gradient(180deg,rgba(30,27,75,0.94)_0%,rgba(15,118,110,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(79,70,229,0.3)_0%,rgba(15,118,110,0.52)_100%)]"
      symbolBg="from-indigo-200 via-sky-300 to-emerald-300"
      symbols={["STEP", "RUNE", "GATE", "CREST", "BONUS", "WILD"]}
      labels={{
        STEP: "Step",
        RUNE: "Rune",
        GATE: "Gate",
        CREST: "Crest",
        BONUS: "Summit",
        WILD: "Path",
      }}
    />
  );
}
