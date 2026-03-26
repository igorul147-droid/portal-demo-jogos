"use client";

import { useEffect, useState } from "react";
import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";
import StatsCard from "@/components/StatsCard";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import { getAccounts, getRecoveryLog, RecoveryLogItem, DemoAccount } from "@/lib/authStorage";

function formatarMoedas(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function PerfilPage() {
  const {
    nomeUsuario,
    setNomeUsuario,
    saldo,
    totalApostadoGlobal,
    totalGanhoGlobal,
    totalRodadasGlobal,
    ranking,
  } = useDemoWallet();
  const [contas, setContas] = useState<DemoAccount[]>([]);
  const [emailsRecuperacao, setEmailsRecuperacao] = useState<RecoveryLogItem[]>([]);

  useEffect(() => {
    setContas(getAccounts());
    setEmailsRecuperacao(getRecoveryLog());
  }, []);

  const lucroGlobal = totalGanhoGlobal - totalApostadoGlobal;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <PortalHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <a
          href="/"
          className="inline-flex rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
        >
          ← Voltar para o portal
        </a>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/50">Perfil da conta</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Área do jogador
            </h1>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-white/50">Nome do jogador</p>
                <input
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-white/50">Saldo atual</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-300">
                  {formatarMoedas(saldo)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <StatsCard label="Rodadas globais" value={String(totalRodadasGlobal)} />
              <StatsCard
                label="Total apostado"
                value={formatarMoedas(totalApostadoGlobal)}
              />
              <StatsCard
                label="Total ganho"
                value={formatarMoedas(totalGanhoGlobal)}
                highlight
              />
              <StatsCard
                label="Lucro global"
                value={`${lucroGlobal >= 0 ? "+" : ""}${formatarMoedas(lucroGlobal)}`}
                highlight={lucroGlobal >= 0}
              />
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/50">Colocação</p>
            <h2 className="mt-2 text-2xl font-semibold">Ranking local</h2>

            <div className="mt-6 space-y-3">
              {ranking.map((item, index) => (
                <div
                  key={`${item.nome}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.nome}</p>
                      <p className="text-sm text-white/45">Jogador</p>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-emerald-300">
                    {formatarMoedas(item.moedas)}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Historico de cadastro</h3>
            <p className="mt-1 text-sm text-white/55">Cada email e CPF so podem ser cadastrados uma vez.</p>

            <div className="mt-4 space-y-3">
              {contas.length === 0 && (
                <p className="text-sm text-white/60">Nenhum cadastro encontrado neste dispositivo.</p>
              )}
              {contas.map((conta) => (
                <div
                  key={conta.email}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
                >
                  <p className="font-semibold">{conta.nome}</p>
                  <p className="text-white/65">{conta.email}</p>
                  <p className="text-white/45">Criado em {new Date(conta.criadoEm).toLocaleString("pt-BR")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Historico de recuperacao</h3>
            <p className="mt-1 text-sm text-white/55">Ultimos emails padrao enviados para recuperar conta.</p>

            <div className="mt-4 space-y-3">
              {emailsRecuperacao.length === 0 && (
                <p className="text-sm text-white/60">Nenhum email de recuperacao foi enviado ainda.</p>
              )}
              {emailsRecuperacao.map((item, index) => (
                <div
                  key={`${item.email}-${item.enviadoEm}-${index}`}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
                >
                  <p className="font-semibold">{item.email}</p>
                  <p className="text-white/45">{new Date(item.enviadoEm).toLocaleString("pt-BR")}</p>
                  <p className="mt-1 text-xs text-white/55">{item.template}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}