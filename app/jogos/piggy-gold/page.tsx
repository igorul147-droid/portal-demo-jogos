"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function PiggyGoldPage() {
  return (
    <LocalSlotPage
      title="Piggy Gold"
      subtitle="O porquinho dourado com cofres e multiplicadores instantâneos"
      icon="🐷"
      themeClass="bg-gradient-to-br from-pink-500/20 via-rose-500/15 to-amber-500/20"
      symbols={["🐷", "🪙", "💰", "🎰", "⭐", "💎"]}
    />
  );
}
