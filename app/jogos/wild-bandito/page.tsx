"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function WildBanditoPage() {
  return (
    <LocalSlotPage
      title="Wild Bandito"
      subtitle="O bandido selvagem que distribui premios"
      icon="🎸"
      themeClass="bg-gradient-to-br from-red-600/20 via-orange-500/15 to-yellow-500/20"
      symbols={["🎸", "💀", "🌵", "💰", "🔥", "🤠"]}
    />
  );
}
