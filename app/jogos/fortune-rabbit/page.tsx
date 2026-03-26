"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function FortuneRabbitPage() {
  return (
    <FortuneSeriesPage
      title="Fortune Rabbit"
      shortTitle="Rabbit Fortune"
      mascot="🐇"
      provider="PG Inspired"
      headerAccent="linear-gradient(180deg,rgba(88,56,180,0.88)_0%,rgba(29,17,72,0.98)_100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(147,197,253,0.18),_transparent_20%),linear-gradient(180deg,rgba(104,64,208,0.92)_0%,rgba(73,26,138,0.96)_100%)]"
      controlAccent="bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_20%),linear-gradient(180deg,rgba(153,27,27,0.96)_0%,rgba(120,18,51,0.98)_100%)]"
      symbolBg="from-fuchsia-300 via-sky-300 to-yellow-300"
      bonusName="Rabbit Bonus"
      symbols={["🥕", "🎆", "🪙", "🧧", "WILD", "BONUS"]}
      labels={{ "🥕": "CARROT", "🎆": "ROCKET", "🪙": "COIN", "🧧": "LUCK", WILD: "WILD", BONUS: "BONUS" }}
    />
  );
}
