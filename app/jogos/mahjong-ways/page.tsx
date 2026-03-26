"use client";

import LocalSlotPage from "@/components/LocalSlotPage";

export default function MahjongWaysPage() {
  return (
    <LocalSlotPage
      title="Mahjong Ways"
      subtitle="Estilo oriental com combinacoes progressivas e bonus"
      icon="🎋"
      themeClass="bg-gradient-to-br from-sky-500/20 via-blue-500/15 to-emerald-500/20"
      symbols={["🀄", "🎍", "🏮", "💠", "🐉", "🪙"]}
    />
  );
}
