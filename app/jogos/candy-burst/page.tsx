"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function CandyBurstPage() {
  return (
    <LocalSlotPage
      title="Candy Burst"
      subtitle="Explosao de doces com multiplicadores"
      icon="🍬"
      themeClass="bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-cyan-500/20"
      symbols={["🍬", "🍭", "🍡", "🧁", "🍰", "💎"]}
    />
  );
}
