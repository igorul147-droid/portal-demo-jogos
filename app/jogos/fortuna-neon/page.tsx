"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function FortunaNeonPage() {
  return (
    <FortuneSeriesPage
      title="Fortuna Neon"
      shortTitle="Neon Vault"
      mascot="⚡"
      provider="BetClean Originals"
      bonusName="Neon Surge"
      headerAccent="linear-gradient(165deg,#3b0764 0%,#7e22ce 40%,#0e7490 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.34),_transparent_42%),linear-gradient(180deg,rgba(88,28,135,0.94)_0%,rgba(21,94,117,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(168,85,247,0.3)_0%,rgba(14,116,144,0.52)_100%)]"
      symbolBg="from-fuchsia-200 via-cyan-300 to-violet-300"
      symbols={["NOVA", "SEVEN", "CROWN", "ARC", "BONUS", "WILD"]}
      labels={{
        NOVA: "Nova",
        SEVEN: "Seven",
        CROWN: "Crown",
        ARC: "Arc",
        BONUS: "Pulse",
        WILD: "Neon",
      }}
    />
  );
}
