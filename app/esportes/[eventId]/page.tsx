"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import PortalHeader from "@/components/PortalHeader";
import { formatBRL } from "@/lib/currency";
import {
  clamp,
  findEventById,
  formatLiveClock,
  groupedMarkets,
  sportGlyph,
  type SportsEvent,
} from "@/lib/sportsbook";

export default function EventoEsportivoPage() {
  const params = useParams<{ eventId: string }>();
  const baseEvent = useMemo(() => findEventById(params.eventId), [params.eventId]);
  const [event, setEvent] = useState<SportsEvent | null>(baseEvent ?? null);

  useEffect(() => {
    setEvent(baseEvent ?? null);
  }, [baseEvent]);

  useEffect(() => {
    if (!event?.live) return;

    const interval = window.setInterval(() => {
      setEvent((current) => {
        if (!current) return current;

        return {
          ...current,
          liveMinute: current.liveMinute !== undefined ? current.liveMinute + 1 : current.liveMinute,
          scoreHome: Math.random() < 0.05 ? (current.scoreHome ?? 0) + 1 : current.scoreHome,
          scoreAway: Math.random() < 0.04 ? (current.scoreAway ?? 0) + 1 : current.scoreAway,
          markets: current.markets.map((market) => ({
            ...market,
            odd: Number(clamp(Number((market.odd + (Math.random() - 0.5) * 0.16).toFixed(2)), 1.2, 6.8).toFixed(2)),
          })),
        };
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [event?.live]);

  if (!event) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#05111f_0%,#020817_100%)] text-white">
        <PortalHeader />
        <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">Evento não encontrado</p>
          <h1 className="mt-4 text-4xl font-black text-white">Esse confronto não está disponível</h1>
          <p className="mt-4 max-w-xl text-white/60">A rota existe para aprofundar a navegação do sportsbook, mas esse identificador não corresponde a um evento mockado.</p>
          <Link href="/esportes" className="mt-8 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">
            Voltar para esportes
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const marketGroups = groupedMarkets(event, "Todos");
  const headlineOdds = event.markets.slice(0, 3);
  const totalMarkets = event.markets.length;
  const minOdd = Math.min(...event.markets.map((market) => market.odd));
  const maxOdd = Math.max(...event.markets.map((market) => market.odd));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.14),_transparent_22%),linear-gradient(180deg,#05111f_0%,#020817_100%)] text-white">
      <PortalHeader />

      <section className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(8,15,28,0.92)_0%,rgba(3,7,18,0.98)_100%)]">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/65">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/20 text-[10px] text-cyan-200">
                  {sportGlyph(event.sport)}
                </span>
                {event.sport}
                <span className="text-white/35">•</span>
                {event.league}
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
                {event.home} <span className="text-white/35">vs</span> {event.away}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/65 sm:text-lg">
                Tela individual pensada para aprofundar a navegação: leitura rápida do confronto, status ao vivo, mercados agrupados e destaque para odds principais.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/esportes" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white/80">
                  Voltar
                </Link>
                <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-rose-200">
                  {event.live ? `Ao vivo • ${formatLiveClock(event)}` : event.kickoff}
                </span>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Match center</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
                  <p className="text-xs text-white/45">Casa</p>
                  <p className="mt-2 text-2xl font-black text-white">{event.scoreHome ?? "-"}</p>
                  <p className="mt-1 text-sm text-white/60">{event.home}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
                  <p className="text-xs text-white/45">Relógio</p>
                  <p className="mt-2 text-2xl font-black text-rose-300">{formatLiveClock(event)}</p>
                  <p className="mt-1 text-sm text-white/60">{event.live ? "Mercados oscilando" : "Pré-jogo"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
                  <p className="text-xs text-white/45">Fora</p>
                  <p className="mt-2 text-2xl font-black text-white">{event.scoreAway ?? "-"}</p>
                  <p className="mt-1 text-sm text-white/60">{event.away}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Odds principais</p>
              <div className="mt-4 space-y-3">
                {headlineOdds.map((market) => (
                  <div key={market.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/40">{market.group}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{market.label}</p>
                    <p className="mt-3 text-2xl font-black text-amber-300">{market.odd.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Resumo</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs text-white/45">Total de mercados</p>
                  <p className="mt-2 text-2xl font-black text-cyan-300">{totalMarkets}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs text-white/45">Faixa de odds</p>
                  <p className="mt-2 text-2xl font-black text-emerald-300">{minOdd.toFixed(2)} - {maxOdd.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Mercados agrupados</p>
                <h2 className="mt-2 text-2xl font-black text-white">Profundidade do confronto</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                Atualização mock a cada 5s
              </span>
            </div>

            <div className="mt-5 space-y-5">
              {Object.entries(marketGroups).map(([groupName, markets]) => (
                <section key={groupName} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">Grupo</p>
                      <h3 className="mt-1 text-xl font-black text-white">{groupName}</h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                      {markets.length} opções
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {markets.map((market) => (
                      <article key={market.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/40">Mercado</p>
                        <p className="mt-2 text-sm font-semibold text-white">{market.label}</p>
                        <p className="mt-4 text-2xl font-black text-amber-300">{market.odd.toFixed(2)}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}