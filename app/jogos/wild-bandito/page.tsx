"use client";
import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function WildBanditoPage() {
  return (
    <FortuneSeriesPage
      title="Wild Bandito"
      shortTitle="Outlaw Fiesta"
      mascot="🤠"
      provider="PG Soft"
      bonusName="Bandit Rampage"
      headerAccent="linear-gradient(165deg,#3d1204 0%,#8d2a0a 40%,#d97706 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.34),_transparent_44%),linear-gradient(180deg,rgba(127,29,29,0.92)_0%,rgba(120,53,15,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(180,83,9,0.28)_0%,rgba(120,53,15,0.52)_100%)]"
      symbolBg="from-orange-200 via-amber-300 to-red-300"
      symbols={["HAT", "GUITAR", "CACTUS", "VAULT", "BONUS", "WILD"]}
      labels={{
        HAT: "Cowboy Hat",
        GUITAR: "Guitar",
        CACTUS: "Cactus",
        VAULT: "Vault",
        BONUS: "Wanted",
        WILD: "Bandito",
      }}
    />
  );
}
