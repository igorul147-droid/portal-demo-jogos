"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function WildWestGoldPage() {
  return (
    <FortuneSeriesPage
      title="Wild West Gold"
      shortTitle="Dust & Glory"
      mascot="🤠"
      provider="Pragmatic Play"
      bonusName="Sheriff Spin"
      headerAccent="linear-gradient(165deg,#3d1204 0%,#9a3412 42%,#d97706 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.34),_transparent_42%),linear-gradient(180deg,rgba(120,53,15,0.94)_0%,rgba(154,52,18,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(217,119,6,0.32)_0%,rgba(120,53,15,0.5)_100%)]"
      symbolBg="from-amber-200 via-orange-300 to-yellow-300"
      symbols={["HAT", "HORSE", "REVOLVER", "VAULT", "BONUS", "WILD"]}
      labels={{
        HAT: "Hat",
        HORSE: "Horse",
        REVOLVER: "Revolver",
        VAULT: "Vault",
        BONUS: "Sheriff",
        WILD: "Outlaw",
      }}
    />
  );
}
