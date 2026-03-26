"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function GemSaviourPage() {
  return (
    <LocalSlotPage
      title="Gem Saviour"
      subtitle="Salve as gemas e ganhe grandes premios"
      icon="💎"
      themeClass="bg-gradient-to-br from-cyan-600/20 via-blue-500/15 to-violet-500/20"
      symbols={["💎", "💍", "🔷", "🔹", "⭐", "🪙"]}
    />
  );
}
