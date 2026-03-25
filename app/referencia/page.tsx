"use client";

import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";
import { Users, Copy, CheckCircle, Gift, TrendingUp, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Referencia() {
  const [copiado, setCopiado] = useState(false);
  const codigoReferencia = "IGOR2025BET";

  const handleCopiar = () => {
    navigator.clipboard.writeText(codigoReferencia);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const referrals = [
    {
      nome: "Pedro Silva",
      dataInscricao: "15/03/2025",
      depositos: 3,
      ganhoTotal: "R$ 2.450,00",
      suaComissao: "R$ 245,00"
    },
    {
      nome: "Marina Costa",
      dataInscricao: "12/03/2025",
      depositos: 5,
      ganhoTotal: "R$ 5.680,00",
      suaComissao: "R$ 568,00"
    },
    {
      nome: "Carlos Santos",
      dataInscricao: "08/03/2025",
      depositos: 2,
      ganhoTotal: "R$ 1.200,00",
      suaComissao: "R$ 120,00"
    }
  ];

  const bonus = [
    {
      titulo: "Bônus de Boas-vindas",
      descricao: "100% de match no primeiro depósito",
      valor: "até R$ 500",
      icone: "🎁",
      requisito: "Deposit e aposte 20x"
    },
    {
      titulo: "Reload Semanal",
      descricao: "Créditos extras toda segunda",
      valor: "até R$ 200",
      icone: "📈",
      requisito: "Sem rollover"
    },
    {
      titulo: "Cashback Especial",
      descricao: "Recuperação de perdas",
      valor: "até 15%",
      icone: "💰",
      requisito: "Apenas apostas perdidas"
    },
    {
      titulo: "Programa VIP",
      descricao: "Rewards exclusivos para players",
      valor: "Ilimitado",
      icone: "👑",
      requisito: "Atinja 100k em apostas"
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <PortalHeader />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
          💎 Programa Premium
        </span>
        <h1 className="text-5xl font-bold">
          Ganhe com <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">Referências</span>
        </h1>
        <p className="mt-4 text-white/60 max-w-2xl mx-auto">
          Convide amigos, ganhe comissões automáticas e desbloqueie benefícios VIP exclusivos.
        </p>
      </section>

      {/* Código de Referência */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-r from-amber-400/10 to-yellow-400/5 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-2xl bg-amber-400/20 p-4">
              <Users size={32} className="text-amber-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Seu Código Único</h2>
              <p className="text-white/60 text-sm mt-1">Compartilhe com amigos e ganhe comissões</p>
            </div>
          </div>

          <div className="bg-black/50 rounded-2xl border border-white/10 p-6 flex items-center justify-between mt-6">
            <div>
              <p className="text-sm text-white/60 mb-2">Código de Referência</p>
              <p className="text-3xl font-bold font-mono">{codigoReferencia}</p>
            </div>
            <button
              onClick={handleCopiar}
              className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-3 font-semibold hover:scale-[1.02] transition flex items-center gap-2"
            >
              {copiado ? (
                <>
                  <CheckCircle size={20} />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copiar
                </>
              )}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <p className="text-sm text-white/60 mb-1">👥 Pessoas Indicadas</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <p className="text-sm text-white/60 mb-1">💵 Comissão Este Mês</p>
              <p className="text-2xl font-bold text-amber-300">R$ 933,00</p>
            </div>
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <p className="text-sm text-white/60 mb-1">📊 Total Vitalício</p>
              <p className="text-2xl font-bold text-emerald-300">R$ 2.156,00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="text-3xl font-bold mb-8">Como Funciona</h2>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="rounded-full bg-blue-500/20 w-12 h-12 flex items-center justify-center mb-4 text-xl">
              1️⃣
            </div>
            <h3 className="font-semibold text-lg mb-2">Compartilhe</h3>
            <p className="text-white/60 text-sm">Envie seu código para amigos via WhatsApp, Email ou qualquer rede social</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="rounded-full bg-purple-500/20 w-12 h-12 flex items-center justify-center mb-4 text-xl">
              2️⃣
            </div>
            <h3 className="font-semibold text-lg mb-2">Eles Registram</h3>
            <p className="text-white/60 text-sm">Seus amigos criam conta usando seu código de referência</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="rounded-full bg-emerald-500/20 w-12 h-12 flex items-center justify-center mb-4 text-xl">
              3️⃣
            </div>
            <h3 className="font-semibold text-lg mb-2">Eles Depositam</h3>
            <p className="text-white/60 text-sm">Fazem o primeiro depósito (mínimo R$ 50,00)</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="rounded-full bg-amber-500/20 w-12 h-12 flex items-center justify-center mb-4 text-xl">
              4️⃣
            </div>
            <h3 className="font-semibold text-lg mb-2">Você Ganha</h3>
            <p className="text-white/60 text-sm">Receba R$ 50 + 10% permanente de todas as apostas deles</p>
          </div>
        </div>
      </section>

      {/* Referrals Atuais */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">📊 Seus Referrals</h2>

        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-white/60">Nome</th>
                  <th className="p-4 text-center text-white/60">Inscrição</th>
                  <th className="p-4 text-center text-white/60">Depósitos</th>
                  <th className="p-4 text-right text-white/60">Ganho Total</th>
                  <th className="p-4 text-right text-white/60">Sua Comissão</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="p-4 font-semibold">{ref.nome}</td>
                    <td className="p-4 text-center text-white/70">{ref.dataInscricao}</td>
                    <td className="p-4 text-center text-white/70">{ref.depositos}</td>
                    <td className="p-4 text-right text-white/70">{ref.ganhoTotal}</td>
                    <td className="p-4 text-right">
                      <span className="text-amber-300 font-semibold">{ref.suaComissao}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bônus Ativos */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-3xl font-bold mb-8">🎁 Promoções Ativas</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {bonus.map((item, i) => (
            <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-4xl mb-4">{item.icone}</p>
              <h3 className="font-semibold text-lg mb-2">{item.titulo}</h3>
              <p className="text-white/60 text-sm mb-4">{item.descricao}</p>
              <div className="rounded-2xl bg-gradient-to-r from-emerald-400/20 to-cyan-400/10 p-3 mb-4">
                <p className="text-emerald-300 font-bold text-sm">{item.valor}</p>
              </div>
              <p className="text-xs text-white/50 border-t border-white/10 pt-4">
                {item.requisito}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
