"use client";
import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function JokersJewelsPage() {
  return (
    <FortuneSeriesPage
      title="Joker's Jewels"
      shortTitle="Carnival Riches"
      mascot="🃏"
      provider="Pragmatic Play"
      bonusName="Joker Parade"
      headerAccent="linear-gradient(165deg,#27043d 0%,#5b0b83 42%,#1d4ed8 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.34),_transparent_42%),linear-gradient(180deg,rgba(55,6,77,0.92)_0%,rgba(30,64,175,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(124,58,237,0.3)_0%,rgba(37,99,235,0.48)_100%)]"
      symbolBg="from-violet-200 via-fuchsia-300 to-sky-300"
      symbols={["JOKER", "RUBY", "MASK", "CROWN", "BONUS", "WILD"]}
      labels={{
        JOKER: "Joker",
        RUBY: "Ruby",
        MASK: "Mask",
        CROWN: "Crown",
        BONUS: "Parade",
        WILD: "Royal",
      }}
    />
  );
}
