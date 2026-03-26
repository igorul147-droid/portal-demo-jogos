"use client";

import LocalSlotPage from "@/components/LocalSlotPage";

export default function FortuneTigerPage() {
  return (
    <LocalSlotPage
      title="Fortune Tiger"
      subtitle="Tigre da sorte com multiplicadores e premios em cadeia"
      icon="🐯"
      themeClass="bg-gradient-to-br from-orange-500/25 via-red-500/15 to-yellow-500/20"
      symbols={["🐯", "🪙", "🍀", "💎", "🔥", "⭐"]}
    />
  );
}
