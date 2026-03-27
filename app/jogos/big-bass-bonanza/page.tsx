"use client";
import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function BigBassBonanzaPage() {
  return (
    <FortuneSeriesPage
      title="Big Bass Bonanza"
      shortTitle="Deep Catch"
      mascot="🎣"
      provider="Pragmatic Play"
      bonusName="Fisher Rush"
      headerAccent="linear-gradient(165deg,#082f49 0%,#0e7490 42%,#0f766e 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.34),_transparent_42%),linear-gradient(180deg,rgba(8,47,73,0.94)_0%,rgba(15,118,110,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(6,182,212,0.3)_0%,rgba(15,118,110,0.5)_100%)]"
      symbolBg="from-cyan-200 via-sky-300 to-emerald-300"
      symbols={["ROD", "FISH", "BOAT", "CHEST", "BONUS", "WILD"]}
      labels={{
        ROD: "Rod",
        FISH: "Fish",
        BOAT: "Boat",
        CHEST: "Chest",
        BONUS: "Catch",
        WILD: "Fisher",
      }}
    />
  );
}
