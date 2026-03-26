"use client";

import LocalSlotPage from "@/components/LocalSlotPage";

export default function DragonHatchPage() {
  return (
    <LocalSlotPage
      title="Dragon Hatch"
      subtitle="Ovos misteriosos, dragoes lendarios e premios altos"
      icon="🐉"
      themeClass="bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-indigo-500/20"
      symbols={["🐉", "🥚", "🔥", "💎", "⚔️", "👑"]}
    />
  );
}
