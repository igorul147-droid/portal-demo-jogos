"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";

export default function SweetBonanzaPage() {
  const router = useRouter();
  const { saldo, setSaldo } = useDemoWallet();
  const [aposta, setAposta] = useState(10);
  const [carregando, setCarregando] = useState(false);

  // URL demo do PG Soft para Sweet Bonanza
  const gameUrl = "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20sbxmas&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&l=pt";

  function handleJogar() {
    if (saldo < aposta) {
      alert("Saldo insuficiente!");
      return;
    }

    setCarregando(true);

    // Simula processamento
    setTimeout(() => {
      // Deduz aposta
      setSaldo(saldo - aposta);

      // Abre jogo em nova aba
      window.open(gameUrl, '_blank');

      setCarregando(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <PortalHeader />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header do Jogo */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold text-2xl">
              🍭
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Sweet Bonanza</h1>
              <p className="text-white/60">Slot Candy Crush do PG Soft</p>
            </div>
          </div>

          {/* RTP e Volatilidade */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="rounded-xl bg-white/5 px-4 py-2">
              <div className="text-sm text-white/60">RTP</div>
              <div className="text-lg font-bold text-green-400">96.48%</div>
            </div>
            <div className="rounded-xl bg-white/5 px-4 py-2">
              <div className="text-sm text-white/60">Volatilidade</div>
              <div className="text-lg font-bold text-yellow-400">Alta</div>
            </div>
            <div className="rounded-xl bg-white/5 px-4 py-2">
              <div className="text-sm text-white/60">Máx. Multiplicador</div>
              <div className="text-lg font-bold text-purple-400">x100</div>
            </div>
          </div>
        </div>

        {/* Área do Jogo */}
        <div className="mb-8">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🍬🎰🍭</div>
                <p className="text-white/60 mb-4">Jogo Demo - PG Soft</p>
                <p className="text-sm text-white/40">Clique em "Jogar Demo" para abrir em nova aba</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Configurações */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Configurações</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Valor da Aposta</label>
                <div className="flex gap-2">
                  {[1, 5, 10, 25, 50, 100].map((valor) => (
                    <button
                      key={valor}
                      onClick={() => setAposta(valor)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        aposta === valor
                          ? 'bg-amber-500 text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      R$ {valor}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/70">Saldo Atual:</span>
                  <span className="text-xl font-bold text-green-400">R$ {saldo.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Aposta:</span>
                  <span className="text-xl font-bold text-amber-400">R$ {aposta.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Ações</h3>

            <div className="space-y-4">
              <button
                onClick={handleJogar}
                disabled={carregando || saldo < aposta}
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-4 font-bold text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? "Carregando..." : "🎰 Jogar Demo"}
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                ← Voltar aos Jogos
              </button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-blue-300 mb-2">💡 Sobre o Modo Demo</h4>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• Moedas virtuais ilimitadas</li>
                <li>• Mesmas mecânicas do jogo real</li>
                <li>• Perfeito para praticar estratégias</li>
                <li>• Sem risco financeiro</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Sobre Sweet Bonanza</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">🎯 Características</h4>
              <ul className="text-white/70 space-y-1">
                <li>• 6 rolos e até 4.096 linhas de pagamento</li>
                <li>• Sistema Tumble (avalanches)</li>
                <li>• Multiplicadores progressivos</li>
                <li>• Rodadas grátis com multiplicadores</li>
                <li>• Jackpot progressivo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">🍬 Tema</h4>
              <p className="text-white/70">
                Mergulhe no mundo doce dos doces! Sweet Bonanza traz mecânicas inovadoras
                com avalanches de símbolos e multiplicadores crescentes. Cada vitória
                derruba os símbolos vencedores, dando chance de novas combinações!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}