"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function StarlightPrincessPage() {
  return (
    <LocalSlotPage
      title="Starlight Princess"
      subtitle="A princesa das estrelas com multiplicadores magicos"
      icon="⭐"
      themeClass="bg-gradient-to-br from-violet-600/20 via-purple-500/15 to-pink-500/20"
      symbols={["⭐", "🌟", "💫", "👑", "💎", "🪄"]}
    />
  );
}
