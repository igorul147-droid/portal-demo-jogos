"use client";
import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function LeprechaunRichesPage() {
  return (
    <FortuneSeriesPage
      title="Leprechaun Riches"
      shortTitle="Lucky Clover"
      mascot="🍀"
      provider="PG Soft"
      bonusName="Pot of Gold"
      headerAccent="linear-gradient(165deg,#022f1f 0%,#0f5132 46%,#6a8b14 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.34),_transparent_42%),linear-gradient(180deg,rgba(14,116,62,0.9)_0%,rgba(18,58,38,0.96)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(15,118,110,0.26)_0%,rgba(5,46,22,0.5)_100%)]"
      symbolBg="from-lime-300 via-emerald-300 to-amber-200"
      symbols={["CLOVER", "HAT", "COIN", "RAINBOW", "BONUS", "WILD"]}
      labels={{
        CLOVER: "Clover",
        HAT: "Top Hat",
        COIN: "Gold Coin",
        RAINBOW: "Rainbow",
        BONUS: "Pot",
        WILD: "Lucky",
      }}
    />
  );
}
