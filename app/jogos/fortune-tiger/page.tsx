"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function FortuneTigerPage() {
  return (
    <FortuneSeriesPage
      title="Fortune Tiger"
      shortTitle="Tiger Vault"
      mascot="🐯"
      provider="PG Soft"
      bonusName="Tiger Fortune"
      headerAccent="linear-gradient(165deg,#3b0f06 0%,#8b2a0a 42%,#b45309 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.34),_transparent_42%),linear-gradient(180deg,rgba(120,53,15,0.94)_0%,rgba(127,29,29,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(217,119,6,0.32)_0%,rgba(127,29,29,0.52)_100%)]"
      symbolBg="from-amber-200 via-orange-300 to-red-300"
      symbols={["TIGER", "LANTERN", "COIN", "FIRE", "BONUS", "WILD"]}
      labels={{
        TIGER: "Tiger",
        LANTERN: "Lantern",
        COIN: "Coin",
        FIRE: "Fire",
        BONUS: "Fortune",
        WILD: "Roar",
      }}
    />
  );
}
