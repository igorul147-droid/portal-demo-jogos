"use client";
import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function WolfGoldPage() {
  return (
    <FortuneSeriesPage
      title="Wolf Gold"
      shortTitle="Moon Hunt"
      mascot="🐺"
      provider="Pragmatic Play"
      bonusName="Lunar Wild"
      headerAccent="linear-gradient(165deg,#111827 0%,#1f2937 42%,#854d0e 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.34),_transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.94)_0%,rgba(51,65,85,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(71,85,105,0.3)_0%,rgba(120,53,15,0.45)_100%)]"
      symbolBg="from-slate-200 via-zinc-300 to-amber-300"
      symbols={["WOLF", "EAGLE", "LION", "MOON", "BONUS", "WILD"]}
      labels={{
        WOLF: "Wolf",
        EAGLE: "Eagle",
        LION: "Lion",
        MOON: "Moon",
        BONUS: "Totem",
        WILD: "Howl",
      }}
    />
  );
}
