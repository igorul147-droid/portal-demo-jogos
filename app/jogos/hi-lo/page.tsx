"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function HiLoPage() {
  return (
    <FortuneSeriesPage
      title="Hi-Lo"
      shortTitle="Card Ladder"
      mascot="🃏"
      provider="BetClean Originals"
      bonusName="Royal Guess"
      headerAccent="linear-gradient(165deg,#111827 0%,#1e3a8a 42%,#6d28d9 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.34),_transparent_42%),linear-gradient(180deg,rgba(30,58,138,0.94)_0%,rgba(76,29,149,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(37,99,235,0.3)_0%,rgba(109,40,217,0.52)_100%)]"
      symbolBg="from-sky-200 via-indigo-300 to-violet-300"
      symbols={["ACE", "KING", "QUEEN", "JACK", "BONUS", "WILD"]}
      labels={{
        ACE: "Ace",
        KING: "King",
        QUEEN: "Queen",
        JACK: "Jack",
        BONUS: "Royal",
        WILD: "Joker",
      }}
    />
  );
}
