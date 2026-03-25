"use client";

import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import { TrendingUp, TrendingDown, Target, Zap, Calendar, BarChart3 } from 'lucide-react';

export default function Analise() {
  const { totalApostadoGlobal, totalGanhoGlobal, totalRodadasGlobal } = useDemoWallet();
  
  const lucroGlobal = totalGanhoGlobal - totalApostadoGlobal;
  const roiPorcentagem = totalApostadoGlobal > 0 ? ((lucroGlobal / totalApostadoGlobal) * 100).toFixed(1) : 0;
  const ticketMedio = totalRodadasGlobal > 0 ? (totalApostadoGlobal / totalRodadasGlobal).toFixed(2) : 0;

  // Dados fictícios de estatísticas
  const estatisticas = [
    {
      titulo: "Total Apostado",
      valor: `R$ ${(totalApostadoGlobal / 100).toFixed(2)}`,
      percentualMês: "+12.5%",
      icone: Target,
      cor: "from-blue-500/20 to-cyan-500/10"
    },
    {
      titulo: "Total Ganho",
      valor: `R$ ${(totalGanhoGlobal / 100).toFixed(2)}`,
      percentualMês: "+8.3%",
      icone: TrendingUp,
      cor: "from-emerald-500/20 to-teal-500/10"
    },
    {
      titulo: "ROI (Retorno)",
      valor: `${roiPorcentagem}%`,
      percentualMês: lucroGlobal >= 0 ? "Positivo" : "Negativo",
      icone: TrendingUp,
      cor: lucroGlobal >= 0 ? "from-emerald-500/20 to-green-500/10" : "from-red-500/20 to-orange-500/10"
    },
    {
      titulo: "Ticket Médio",
      valor: `R$ ${ticketMedio}`,
      percentualMês: `${totalRodadasGlobal} rodadas`,
      icone: Zap,
      cor: "from-amber-500/20 to-yellow-500/10"
    }
  ];

  const jogosMaisJogados = [
    { nome: "Sweet Bonanza", jogadas: 156, ganho: 2850, rtp: "96.5%" },
    { nome: "Fortune Tiger", jogadas: 142, ganho: 3120, rtp: "97.2%" },
    { nome: "Gates of Olympus", jogadas: 138, ganho: 2650, rtp: "98.1%" },
    { nome: "Mahjong Ways", jogadas: 125, ganho: 2400, rtp: "96.8%" },
    { nome: "Wild West Gold", jogadas: 98, ganho: 1950, rtp: "97.5%" }
  ];

  const performancePorDia = [
    { dia: "Seg", ganho: 245, aposta: 180 },
    { dia: "Ter", ganho: 320, aposta: 260 },
    { dia: "Qua", ganho: 280, aposta: 220 },
    { dia: "Qui", ganho: 410, aposta: 350 },
    { dia: "Sex", ganho: 520, aposta: 480 },
    { dia: "Sab", ganho: 620, aposta: 550 },
    { dia: "Dom", ganho: 580, aposta: 520 }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <PortalHeader />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
          📊 Analytics & Performance
        </span>
        <h1 className="text-5xl font-bold">
          Seu Desempenho em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Tempo Real</span>
        </h1>
        <p className="mt-4 text-white/60 max-w-2xl mx-auto">
          Análise detalhada de suas apostas, ganhos e estratégias vencedoras.
        </p>
      </section>

      {/* Cards de Estatísticas */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-4">
          {estatisticas.map((stat, i) => {
            const Icon = stat.icone;
            return (
              <div
                key={i}
                className={`rounded-3xl border border-white/10 bg-gradient-to-br ${stat.cor} backdrop-blur p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white/60">
                    {stat.percentualMês}
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-1">{stat.titulo}</p>
                <p className="text-3xl font-bold">{stat.valor}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gráfico de Performance */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 size={28} />
            Performance por Dia (Última Semana)
          </h2>

          <div className="flex items-end justify-between gap-4 h-64">
            {performancePorDia.map((dia, i) => {
              const maxValue = Math.max(...performancePorDia.map(d => d.ganho + d.aposta));
              const altura = (dia.ganho / maxValue) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full bg-gradient-to-t from-emerald-500/40 to-emerald-500/20 rounded-t-lg" style={{ height: `${altura}%` }} />
                    <span className="text-xs text-white/50 mt-2">{dia.dia}</span>
                  </div>
                  <div className="text-center text-xs">
                    <p className="text-emerald-300 font-semibold">+R$ {dia.ganho}</p>
                    <p className="text-white/40 text-xs">-R$ {dia.aposta}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/40" />
              <span className="text-white/70">Ganho Total</span>
            </div>
          </div>
        </div>
      </section>

      {/* Jogos Mais Jogados */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">🎮 Seus Jogos Favoritos</h2>

        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-white/60">Jogo</th>
                  <th className="p-4 text-center text-white/60">Jogadas</th>
                  <th className="p-4 text-right text-white/60">Ganho</th>
                  <th className="p-4 text-right text-white/60">RTP Anual</th>
                </tr>
              </thead>
              <tbody>
                {jogosMaisJogados.map((jogo, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="p-4 font-semibold">{jogo.nome}</td>
                    <td className="p-4 text-center text-white/70">{jogo.jogadas}</td>
                    <td className="p-4 text-right">
                      <span className="text-emerald-300 font-semibold">+R$ {(jogo.ganho / 100).toFixed(2)}</span>
                    </td>
                    <td className="p-4 text-right text-white/70">{jogo.rtp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-2xl font-bold mb-6">💡 Insights</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-6">
            <p className="text-sm text-blue-300 font-semibold mb-2">🎯 Maior Ganho</p>
            <p className="text-2xl font-bold">R$ 620,00</p>
            <p className="text-xs text-white/50 mt-1">Sábado passado</p>
          </div>

          <div className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-6">
            <p className="text-sm text-purple-300 font-semibold mb-2">🔥 Jogo Favorito</p>
            <p className="text-2xl font-bold">Fortune Tiger</p>
            <p className="text-xs text-white/50 mt-1">142 jogadas | RTP 97.2%</p>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
            <p className="text-sm text-amber-300 font-semibold mb-2">⏰ Melhor Período</p>
            <p className="text-2xl font-bold">18:00 - 22:00</p>
            <p className="text-xs text-white/50 mt-1">81% de vitórias</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
