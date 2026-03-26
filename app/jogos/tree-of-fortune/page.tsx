"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function TreeOfFortunePage() {
  return (
    <LocalSlotPage
      title="Tree of Fortune"
      subtitle="A arvore da fortuna que da frutos de ouro"
      icon="🌳"
      themeClass="bg-gradient-to-br from-green-500/20 via-teal-500/15 to-emerald-500/20"
      symbols={["🌳", "🍑", "🍊", "🍋", "🍒", "💎"]}
    />
  );
}
