"use client";

import FortuneSeriesPage from "@/components/FortuneSeriesPage";

export default function FortuneOxPage() {
  return (
    <FortuneSeriesPage
      title="Fortune Ox"
      shortTitle="Ox Fortune"
      mascot="🐂"
      provider="PG Inspired"
      headerAccent="linear-gradient(180deg,rgba(210,88,48,0.88)_0%,rgba(89,21,28,0.98)_100%)"
      stageAccent="bg-[radial-gradient(circle_at_top,_rgba(254,240,138,0.16),_transparent_20%),linear-gradient(180deg,rgba(168,49,49,0.92)_0%,rgba(114,24,24,0.96)_100%)]"
      controlAccent="bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.16),_transparent_20%),linear-gradient(180deg,rgba(145,29,29,0.96)_0%,rgba(109,17,17,0.98)_100%)]"
      symbolBg="from-yellow-300 via-orange-300 to-red-300"
      bonusName="Ox Bonus"
      symbols={["🥮", "🪙", "🧧", "🍊", "WILD", "BONUS"]}
      labels={{ "🥮": "INGOT", "🪙": "COIN", "🧧": "PACKET", "🍊": "ORANGE", WILD: "WILD", BONUS: "BONUS" }}
    />
  );
}
