"use client";
import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function StarlightPrincessPage() {
  return (
    <FortuneSeriesPage
      title="Starlight Princess"
      shortTitle="Cosmic Queen"
      mascot="⭐"
      provider="Pragmatic Play"
      bonusName="Starfall Burst"
      headerAccent="linear-gradient(165deg,#1e1b4b 0%,#5b21b6 42%,#be185d 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(216,180,254,0.34),_transparent_42%),linear-gradient(180deg,rgba(49,46,129,0.94)_0%,rgba(91,33,182,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(124,58,237,0.3)_0%,rgba(190,24,93,0.45)_100%)]"
      symbolBg="from-violet-200 via-fuchsia-300 to-pink-300"
      symbols={["STAR", "CROWN", "ORB", "WAND", "BONUS", "WILD"]}
      labels={{
        STAR: "Star",
        CROWN: "Crown",
        ORB: "Orb",
        WAND: "Wand",
        BONUS: "Meteor",
        WILD: "Princess",
      }}
    />
  );
}
