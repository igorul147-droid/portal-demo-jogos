"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function BigBassBonanzaPage() {
  return (
    <LocalSlotPage
      title="Big Bass Bonanza"
      subtitle="Pesque os peixes dourados e ganhe fortunas"
      icon="🎣"
      themeClass="bg-gradient-to-br from-blue-600/20 via-cyan-500/15 to-teal-500/20"
      symbols={["🎣", "🐟", "🐠", "🐡", "💰", "⭐"]}
    />
  );
}
