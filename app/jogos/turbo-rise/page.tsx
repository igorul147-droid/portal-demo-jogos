"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function TurboRisePage() {
  return (
    <FortuneSeriesPage
      title="Turbo Rise"
      shortTitle="Flight Spin"
      mascot="✈️"
      provider="BetClean Originals"
      bonusName="Sky Burst"
      headerAccent="linear-gradient(165deg,#082f49 0%,#0e7490 42%,#7c2d12 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.34),_transparent_42%),linear-gradient(180deg,rgba(8,47,73,0.94)_0%,rgba(124,45,18,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(14,165,233,0.3)_0%,rgba(194,65,12,0.52)_100%)]"
      symbolBg="from-sky-200 via-cyan-300 to-orange-300"
      symbols={["JET", "ALT", "WING", "THRUST", "BONUS", "WILD"]}
      labels={{
        JET: "Jet",
        ALT: "Altitude",
        WING: "Wing",
        THRUST: "Thrust",
        BONUS: "Burst",
        WILD: "Pilot",
      }}
    />
  );
}
