"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function LeprechaunRichesPage() {
  return (
    <LocalSlotPage
      title="Leprechaun Riches"
      subtitle="O duende irlandes com pote de ouro"
      icon="☘️"
      themeClass="bg-gradient-to-br from-green-600/20 via-emerald-500/15 to-lime-500/20"
      symbols={["☘️", "🍀", "🪙", "💰", "🌈", "🎩"]}
    />
  );
}
