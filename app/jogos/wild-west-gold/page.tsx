"use client";

import LocalSlotPage from "@/components/LocalSlotPage";

export default function WildWestGoldPage() {
  return (
    <LocalSlotPage
      title="Wild West Gold"
      subtitle="Tema de faroeste com multiplicadores e alta volatilidade"
      icon="🏜️"
      themeClass="bg-gradient-to-br from-amber-500/25 via-orange-500/15 to-yellow-500/20"
      symbols={["🤠", "💰", "🪙", "⭐", "🔫", "🐎"]}
    />
  );
}
