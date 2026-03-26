"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function GaneshaGoldPage() {
  return (
    <LocalSlotPage
      title="Ganesha Gold"
      subtitle="O deus elefante guardiao das riquezas"
      icon="🐘"
      themeClass="bg-gradient-to-br from-amber-600/20 via-yellow-500/15 to-orange-500/20"
      symbols={["🐘", "🪷", "🪙", "💎", "🔔", "⭐"]}
    />
  );
}
