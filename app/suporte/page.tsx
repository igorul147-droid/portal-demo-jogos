"use client";

import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";
import { Mail, Phone, MessageCircle, Clock, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Suporte() {
  const [respostasAbertas, setRespostasAbertas] = useState<Record<number, boolean>>({});

  const toggleResposta = (id: number) => {
    setRespostasAbertas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqItens = [
    {
      id: 1,
      pergunta: "Como faço para sacar meus ganhos?",
      resposta: "Acesse a seção Carteira, clique em 'Sacar', selecione o método de pagamento (Pix, Banco ou Cripto) e authorize a transação. O saque é processado em até 24 horas."
    },
    {
      id: 2,
      pergunta: "Qual é o mínimo para depositar?",
      resposta: "O depósito mínimo é R$ 50,00 via Pix ou R$ 100,00 via transferência bancária. Para criptomoedas, o mínimo varia conforme a moeda selecionada."
    },
    {
      id: 3,
      pergunta: "Os jogos são justos e seguros?",
      resposta: "Todos os nossos jogos utilizam RNG (Random Number Generator) certificado conforme padrões internacionais eCOGRA. Cada resultado é verificável e auditável."
    },
    {
      id: 4,
      pergunta: "Posso usar bônus e promoções simultaneamente?",
      resposta: "Sim! Você pode acumular bônus de boas-vindas com programas de reload. Consulte os termos específicos de cada promoção para os requisitos de aposta."
    },
    {
      id: 5,
      pergunta: "Como funciona o programa de referência?",
      resposta: "Compartilhe seu código único com amigos. Quando eles se registram e fazem o primeiro depósito, você ganha R$ 50,00 em créditos e 10% do ganho total deles permanentemente."
    },
    {
      id: 6,
      pergunta: "Minha conta foi bloqueada. O que fazer?",
      resposta: "Contas são bloqueadas por razões de segurança ou violação dos termos. Contacte nosso time de suporte com seu email para revisar o caso."
    },
    {
      id: 7,
      pergunta: "Qual é o RTP médio dos jogos?",
      resposta: "RTPs variam por jogo: Slots (96-98%), Crash Games (97-99%), Roleta (96%). Consulte a página de cada jogo para detalhes específicos."
    },
    {
      id: 8,
      pergunta: "Posso auto-excluir minha conta?",
      resposta: "Sim. Vá em Perfil > Configurações > Auto-exclusão. Você terá 7 dias para reconsiderar. Após esse período, a conta é permanentemente deletada."
    }
  ];

  const canaisSuporte = [
    {
      icone: Mail,
      titulo: "Email",
      descricao: "suporte@betclean.com",
      tempo: "Resposta em até 2 horas"
    },
    {
      icone: Phone,
      titulo: "WhatsApp",
      descricao: "+55 (11) 99999-9999",
      tempo: "Disponível 24/7"
    },
    {
      icone: MessageCircle,
      titulo: "Chat ao Vivo",
      descricao: "Disponível no site",
      tempo: "Resposta instantânea"
    },
    {
      icone: Clock,
      titulo: "Horário",
      descricao: "Segunda a Domingo",
      tempo: "7:00 até 23:00"
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <PortalHeader />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
          Suporte Premium
        </span>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Estamos aqui para <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">ajudar</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-white/70 text-lg">
          Resolva suas dúvidas rapidamente com nossa equipe de especialistas disponível 24/7.
        </p>
      </section>

      {/* Canais de Suporte */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-4">
          {canaisSuporte.map((canal, i) => {
            const Icon = canal.icone;
            return (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 p-4">
                    <Icon size={32} className="text-emerald-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{canal.titulo}</h3>
                <p className="mt-2 text-white/60">{canal.descricao}</p>
                <p className="mt-3 text-xs text-emerald-300 font-medium">{canal.tempo}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Status de Segurança */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-cyan-400/5 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-2xl bg-emerald-400/20 p-4">
              <Shield size={32} className="text-emerald-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Segurança de Ponta</h2>
              <p className="text-white/60 text-sm mt-1">Seus dados estão protegidos com os melhores padrões</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <p className="text-sm text-white/60 mb-2">🔒 Criptografia</p>
              <p className="font-semibold">SSL 256-bit</p>
              <p className="text-xs text-white/50 mt-1">Padrão bancário</p>
            </div>
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <p className="text-sm text-white/60 mb-2">✅ Conformidade</p>
              <p className="font-semibold">KYC & AML</p>
              <p className="text-xs text-white/50 mt-1">Anti-fraude</p>
            </div>
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <p className="text-sm text-white/60 mb-2">🛡️ Auditoria</p>
              <p className="font-semibold">Anual</p>
              <p className="text-xs text-white/50 mt-1">Terceiros independentes</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="text-3xl font-bold mb-8">Perguntas Frequentes</h2>

        <div className="space-y-3">
          {faqItens.map(item => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <button
                onClick={() => toggleResposta(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition"
              >
                <p className="font-semibold text-white text-left">{item.pergunta}</p>
                <span className={`text-white/60 transition ${respostasAbertas[item.id] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {respostasAbertas[item.id] && (
                <div className="px-6 py-4 border-t border-white/10 bg-black/30">
                  <p className="text-white/70 leading-relaxed">{item.resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 border border-emerald-400/20 p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Não encontrou sua resposta?</h2>
          <p className="text-white/70 mb-6">Entre em contato com nosso time de especialistas agora mesmo.</p>
          <a
            href="mailto:suporte@betclean.com"
            className="inline-block rounded-2xl bg-white text-black px-8 py-3 font-semibold hover:scale-[1.02] transition"
          >
            Enviar Email
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
