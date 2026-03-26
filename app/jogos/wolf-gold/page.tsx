"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function WolfGoldPage() {
  return (
    <LocalSlotPage
      title="Wolf Gold"
      subtitle="O lobo dourado uiva por premios enormes"
      icon="🐺"
      themeClass="bg-gradient-to-br from-slate-600/20 via-neutral-500/15 to-amber-500/20"
      symbols={["🐺", "🦅", "🦁", "🐻", "💎", "🌕"]}
    />
  );
}
