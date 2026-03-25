"use client";

import { Gift, Zap, TrendingUp, Award, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PromAndBonus() {
  const router = useRouter();
  const [promoAberta, setPromoAberta] = useState<string | null>(null);
  const [aproveitar, setAproveitar] = useState(false);

  const promocoes = [
    {
      titulo: 'Bônus de Boas-vindas',
      descricao: 'Novos jogadores recebem 50% extra no saldo inicial',
      icone: Gift,
      cor: 'from-amber-400 to-orange-500',
      badge: '50%',
      detalhes: 'Ao se cadastrar, você recebe 50% a mais no seu saldo inicial! Por exemplo: se começar com 10.000 moedas, receberá 5.000 moedas extras. Válido apenas para novos usuários.',
      acao: 'cadastro',
    },
    {
      titulo: 'Missões Diárias',
      descricao: 'Complete desafios e ganhe moedas extras todos os dias',
      icone: Zap,
      cor: 'from-yellow-400 to-amber-500',
      badge: 'Novo',
      detalhes: 'Complete missões diárias como "Jogar 5 rodadas" ou "Ganhar 3 vezes seguidas" para ganhar moedas extras. Resete a cada 24 horas e acumule recompensas!',
      acao: 'ativar',
    },
    {
      titulo: 'Programa de Fidelidade',
      descricao: 'Quanto mais você joga, mais recompensas receberá',
      icone: Award,
      cor: 'from-emerald-400 to-teal-500',
      badge: 'Ativo',
      detalhes: 'Ganhe pontos de fidelidade a cada moeda apostada. Ao atingir milestones (1.000, 5.000, 10.000 moedas), desbloqueie novos benefícios e bônus personalizados.',
      acao: 'ativar',
    },
    {
      titulo: 'Torneios Semanais',
      descricao: 'Compita com outros jogadores e gane prêmios',
      icone: TrendingUp,
      cor: 'from-blue-400 to-cyan-500',
      badge: 'Semanal',
      detalhes: 'Participe de torneios semanais onde o ranking é definido por lucro líquido. Os top 3 ganham prêmios extras! Novo torneio a cada segunda-feira.',
      acao: 'ativar',
    },
  ];

  function handleAproveitar() {
    const promoAtual = promocoes.find(p => p.titulo === promoAberta);
    
    if (!promoAtual) return;

    if (promoAtual.acao === 'cadastro') {
      // Redireciona para cadastro
      router.push('/cadastro');
    } else if (promoAtual.acao === 'ativar') {
      // Mostra confirmação
      setAproveitar(true);
      setTimeout(() => {
        setPromoAberta(null);
        setAproveitar(false);
      }, 2000);
    }
  }

  return (
    <section id="promocoes" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8">
        <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
          Recompensas
        </span>
        <h2 className="text-4xl font-bold sm:text-5xl">Promoções e Bônus</h2>
        <p className="mt-4 max-w-2xl text-white/70">
          Novos bônus todos os dias. Quanto mais você joga, mais benefícios desbloqueados.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {promocoes.map((promo) => {
          const Icon = promo.icone;
          return (
            <div
              key={promo.titulo}
              className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${promo.cor} p-0.5`}
            >
              <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-2xl bg-gradient-to-br ${promo.cor} p-3`}>
                    <Icon className="text-black" size={24} />
                  </div>
                  <span className={`rounded-full bg-gradient-to-r ${promo.cor} px-3 py-1 text-xs font-semibold text-black`}>
                    {promo.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{promo.titulo}</h3>
                <p className="mt-2 text-white/70">{promo.descricao}</p>

                <button
                  onClick={() => setPromoAberta(promo.titulo)}
                  className={`mt-4 rounded-2xl bg-gradient-to-r ${promo.cor} px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.05]`}
                >
                  Saiba mais
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Promoção */}
      {promoAberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-950 p-6 animate-fade-in-scale">
            {aproveitar ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-4">
                  <Check size={32} className="text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Promoção ativada!</h2>
                <p className="mt-2 text-center text-white/70">
                  {promoAberta} foi adicionada à sua conta.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-start justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {promocoes.find(p => p.titulo === promoAberta)?.titulo}
                  </h2>
                  <button
                    onClick={() => setPromoAberta(null)}
                    className="rounded-lg p-2 text-white/70 hover:bg-white/10 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-white/80">
                  {promocoes.find(p => p.titulo === promoAberta)?.detalhes}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setPromoAberta(null)}
                    className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={handleAproveitar}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 font-semibold text-black transition hover:scale-[1.02]"
                  >
                    Aproveitar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
