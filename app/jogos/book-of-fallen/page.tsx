"use client";
import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function BookOfFallenPage() {
  return (
    <FortuneSeriesPage
      title="Book of Fallen"
      shortTitle="Fallen Temple"
      mascot="📖"
      provider="Pragmatic Play"
      bonusName="Ancient Ritual"
      headerAccent="linear-gradient(165deg,#2b0906 0%,#5a140c 40%,#8b5a11 100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.34),_transparent_42%),linear-gradient(180deg,rgba(69,10,10,0.92)_0%,rgba(68,35,8,0.95)_100%)]"
      controlAccent="bg-[linear-gradient(180deg,rgba(180,83,9,0.3)_0%,rgba(68,35,8,0.52)_100%)]"
      symbolBg="from-amber-200 via-orange-300 to-rose-300"
      symbols={["BOOK", "URN", "SIGIL", "RELIC", "BONUS", "WILD"]}
      labels={{
        BOOK: "Book",
        URN: "Urn",
        SIGIL: "Sigil",
        RELIC: "Relic",
        BONUS: "Ritual",
        WILD: "Guardian",
      }}
    />
  );
}
