"use client";
import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function GemSaviourPage() {
  return (
    <FortuneSeriesPage
      title="Gem Saviour"
      shortTitle="Crystal Vault"
      mascot="💎"
      provider="PG Soft"
      bonusName="Ancient Chamber"
      headerAccent="linear-gradient(165deg,#08244a 0%,#0f4f8f 42%,#542f9b 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.34),_transparent_42%),linear-gradient(180deg,rgba(30,58,138,0.9)_0%,rgba(46,16,101,0.96)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(14,116,144,0.28)_0%,rgba(37,24,91,0.5)_100%)]"
      symbolBg="from-cyan-200 via-sky-300 to-violet-300"
      symbols={["SAPPHIRE", "RUBY", "SCROLL", "RELIC", "BONUS", "WILD"]}
      labels={{
        SAPPHIRE: "Sapphire",
        RUBY: "Ruby",
        SCROLL: "Map",
        RELIC: "Relic",
        BONUS: "Portal",
        WILD: "Explorer",
      }}
    />
  );
}
