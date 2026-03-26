"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/PortalHeader";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import StatsCard from "@/components/StatsCard";
import { formatBRL } from "@/lib/currency";

const opcoes = [
  { label: "Verde", multiplicador: 2, cor: "bg-emerald-500/20 text-emerald-300" },
  { label: "Azul", multiplicador: 3, cor: "bg-sky-500/20 text-sky-300" },
  { label: "Roxo", multiplicador: 5, cor: "bg-violet-500/20 text-violet-300" },
  { label: "Dourado", multiplicador: 8, cor: "bg-amber-500/20 text-amber-300" },
  { label: "Branco", multiplicador: 12, cor: "bg-white/20 text-white" },
];

function formatarMoedas(valor: number) {
  return formatBRL(valor);
}

function sortearResultado() {
  const numero = Math.random();

  if (numero < 0.4) return opcoes[0];
  if (numero < 0.68) return opcoes[1];
  if (numero < 0.85) return opcoes[2];
  if (numero < 0.96) return opcoes[3];
  return opcoes[4];
}

export default function OrbitWheelPage() {
  const { saldo, setSaldo, resetarTudoGlobal, registrarResultado } =
    useDemoWallet();

  const router = useRouter();
  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  const [aposta, setAposta] = useState(100);
  const [girando, setGirando] = useState(false);
  const [resultadoAtual, setResultadoAtual] = useState(opcoes[0]);
  const [ultimoPremio, setUltimoPremio] = useState(0);
  const [mensagem, setMensagem] = useState("Pronto para girar a roleta.");
  const [historico, setHistorico] = useState<
    { cor: string; premio: number; aposta: number; multiplicador: number }[]
  >([]);
  const [giros, setGiros] = useState(0);
  const [totalApostado, setTotalApostado] = useState(0);
  const [totalGanho, setTotalGanho] = useState(0);
  const [maiorPremio, setMaiorPremio] = useState(0);

  const lucroLiquido = totalGanho - totalApostado;

  const taxaRetorno = useMemo(() => {
    if (totalApostado === 0) return 0;
    return Math.round((totalGanho / totalApostado) * 100);
  }, [totalApostado, totalGanho]);

  function diminuirAposta() {
    setAposta((valor) => Math.max(50, valor - 50));
  }

  function aumentarAposta() {
    setAposta((valor) => Math.min(1000, valor + 50));
  }

  function resetarSessao() {
    resetarTudoGlobal();
    setAposta(100);
    setGirando(false);
    setResultadoAtual(opcoes[0]);
    setUltimoPremio(0);
    setMensagem("Sessão reiniciada.");
    setHistorico([]);
    setGiros(0);
    setTotalApostado(0);
    setTotalGanho(0);
    setMaiorPremio(0);
  }

  function girar() {
    if (girando || saldo < aposta) return;

    setGirando(true);
    setMensagem("Roleta girando...");
    setUltimoPremio(0);

    window.setTimeout(() => {
      const resultado = sortearResultado();
      const premio = aposta * resultado.multiplicador;

      setResultadoAtual(resultado);
      setSaldo((valor) => valor - aposta + premio);
      registrarResultado(aposta, premio);

      setUltimoPremio(premio);
      setHistorico((anterior) => [
        {
          cor: resultado.label,
          premio,
          aposta,
          multiplicador: resultado.multiplicador,
        },
        ...anterior,
      ].slice(0, 8));
      setGiros((valor) => valor + 1);
      setTotalApostado((valor) => valor + aposta);
      setTotalGanho((valor) => valor + premio);
      setMaiorPremio((valor) => Math.max(valor, premio));
      setMensagem(
        `Resultado ${resultado.label} (${resultado.multiplicador}x): +${formatarMoedas(
          premio
        )}.`
      );
      setGirando(false);
    }, 900);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <PortalHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="/"
            className="inline-flex w-fit rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
          >
            ← Voltar para o portal
          </a>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
              Saldo: {formatarMoedas(saldo)}
            </div>

            <button
              onClick={resetarSessao}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Resetar tudo
            </button>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm text-emerald-300">Roleta</p>
                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  Orbit Wheel
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-white/65 sm:text-base">
                  Roleta autoral com prêmios instantâneos por cor e multiplicador.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <StatsCard
                  label="Último prêmio"
                  value={formatarMoedas(ultimoPremio)}
                  highlight
                />
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                  <p className="text-xs text-white/50">Status</p>
                  <p className="mt-1 text-sm font-medium text-white/85">
                    {mensagem}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/40 p-6">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                  Resultado atual
                </p>

                <div
                  className={`mx-auto mt-6 flex h-44 w-44 items-center justify-center rounded-full border border-white/10 text-2xl font-bold ${resultadoAtual.cor} ${
                    girando ? "animate-pulse" : ""
                  }`}
                >
                  {resultadoAtual.label}
                </div>

                <p className="mt-5 text-lg font-semibold">
                  Multiplicador: {resultadoAtual.multiplicador}x
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={girar}
                    disabled={girando || saldo < aposta}
                    className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {girando ? "Girando..." : "Girar roleta"}
                  </button>

                  <button
                    onClick={diminuirAposta}
                    disabled={girando}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                  >
                    -50
                  </button>

                  <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white">
                    Aposta: {formatarMoedas(aposta)}
                  </div>

                  <button
                    onClick={aumentarAposta}
                    disabled={girando}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                  >
                    +50
                  </button>
                </div>

                <div className="text-sm text-white/55">
                  Prêmios instantâneos por multiplicador
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/50">Tabela da roleta</p>
              <h2 className="mt-2 text-2xl font-semibold">Cores e ganhos</h2>

              <div className="mt-6 space-y-3">
                {opcoes.map((opcao) => (
                  <div
                    key={opcao.label}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <p className="font-medium">{opcao.label}</p>
                    <p className="mt-1 text-sm text-white/60">
                      Multiplicador: {opcao.multiplicador}x
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/50">Sessão</p>
              <h3 className="mt-2 text-2xl font-semibold">Estatísticas</h3>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <StatsCard label="Giros" value={String(giros)} />
                <StatsCard label="Retorno" value={`${taxaRetorno}%`} />
                <StatsCard
                  label="Total apostado"
                  value={formatarMoedas(totalApostado)}
                />
                <StatsCard
                  label="Total ganho"
                  value={formatarMoedas(totalGanho)}
                  highlight
                />
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/50">Lucro líquido</p>
                <p
                  className={`mt-1 text-lg font-semibold ${
                    lucroLiquido >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {lucroLiquido >= 0 ? "+" : ""}
                  {formatarMoedas(lucroLiquido)}
                </p>
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/50">Maior prêmio</p>
                <p className="mt-1 text-lg font-semibold text-emerald-300">
                  {formatarMoedas(maiorPremio)}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/50">Histórico</p>
              <h3 className="mt-2 text-2xl font-semibold">Últimos giros</h3>

              <div className="mt-6 space-y-3">
                {historico.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/55">
                    Ainda não houve giros nesta sessão.
                  </div>
                ) : (
                  historico.map((item, index) => (
                    <div
                      key={`${item.cor}-${item.premio}-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white/80">
                          {item.cor} ({item.multiplicador}x)
                        </p>
                        <span className="text-xs text-white/45">
                          Retorno: {formatarMoedas(item.premio)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}