"use client";
import LocalSlotPage from "@/components/LocalSlotPage";
export default function BookOfFallenPage() {
  return (
    <LocalSlotPage
      title="Book of Fallen"
      subtitle="O livro dos caidos guarda segredos e premios"
      icon="📖"
      themeClass="bg-gradient-to-br from-red-900/20 via-orange-700/15 to-amber-600/20"
      symbols={["📖", "⚱️", "🪬", "💎", "🔮", "👁️"]}
    />
  );
}
