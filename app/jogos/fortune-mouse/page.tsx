"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function FortuneMousePage() {
  return (
    <LocalSlotPage
      title="Fortune Mouse"
      subtitle="Ratinho da sorte com tesouros escondidos"
      icon="🐭"
      themeClass="bg-gradient-to-br from-rose-500/20 via-pink-500/15 to-red-500/20"
      symbols={["🐭", "🪙", "🧧", "💎", "🍀", "⭐"]}
    />
  );
}
