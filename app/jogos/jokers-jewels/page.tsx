"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function JokersJewelsPage() {
  return (
    <LocalSlotPage
      title="Joker's Jewels"
      subtitle="O coringa das joias com premios classicos"
      icon="🃏"
      themeClass="bg-gradient-to-br from-purple-600/20 via-indigo-500/15 to-blue-500/20"
      symbols={["🃏", "💎", "💍", "🎭", "⭐", "🪙"]}
    />
  );
}
