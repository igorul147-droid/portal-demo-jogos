"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import PortalHeader from "@/components/PortalHeader";
import StatsCard from "@/components/StatsCard";

const simbolos = ["💎", "7", "👑", "⚡", "🍀"] as const;
const gradeInicial = ["💎", "7", "👑", "⚡", "💎", "🍀", "👑", "⚡", "7"];

const simboloInfo: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    multiplicador3: number;
  }
> = {
  "💎": { label: "Diamante", bg: "bg-cyan-400/15", text: "text-cyan-300", multiplicador3: 8 },
  "7": { label: "Sete", bg: "bg-fuchsia-500/15", text: "text-fuchsia-300", multiplicador3: 12 },
  "👑": { label: "Coroa", bg: "bg-amber-400/15", text: "text-amber-300", multiplicador3: 10 },
  "⚡": { label: "Raio", bg: "bg-orange-400/15", text: "text-orange-300", multiplicador3: 6 },
  "🍀": { label: "Trevo", bg: "bg-emerald-400/15", text: "text-emerald-300", multiplicador3: 5 },
};

const linhasPagamento = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

const apostaMinima = 50;
const apostaMaxima = 1000;
const passoAposta = 50;

function gerarGrade() {
  return Array.from({ length: 9 }, () => {
    const index = Math.floor(Math.random() * simbolos.length);
    return simbolos[index];
  });
}

function avaliarGrade(grade: string[], aposta: number) {
  let premioTotal = 0;
  const linhasVencedoras: number[] = [];
  const detalhes: string[] = [];

  linhasPagamento.forEach((linha, index) => {
    const [a, b, c] = linha.map((posicao) => grade[posicao]);

    if (a === b && b === c) {
      const multiplicador = simboloInfo[a].multiplicador3;
      const premioLinha = aposta * multiplicador;

      premioTotal += premioLinha;
      linhasVencedoras.push(index);
      detalhes.push(
        `Linha ${index + 1}: 3x ${simboloInfo[a].label} (+${premioLinha.toLocaleString(
          "pt-BR"
        )})`
      );
    }
  });

  return { premioTotal, linhasVencedoras, detalhes };
}

function formatarMoedas(valor: number) {
  return `${valor.toLocaleString("pt-BR")} moedas`;
}

export default function FortunaNeonPage() {
  const router = useRouter();
  const { saldo, setSaldo, resetarTudoGlobal, registrarResultado } =
    useDemoWallet();

  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  const [grade, setGrade] = useState<string[]>(gradeInicial);
  const [aposta, setAposta] = useState(100);
  const [girando, setGirando] = useState(false);
  const [ultimoPremio, setUltimoPremio] = useState(0);
  const [mensagem, setMensagem] = useState("Pronto para girar.");
  const [linhasAtivas, setLinhasAtivas] = useState<number[]>([]);
  const [detalhesPremio, setDetalhesPremio] = useState<string[]>([]);
  const [historico, setHistorico] = useState<
    { resultado: string; premio: number; aposta: number }[]
  >([]);
  const [totalApostado, setTotalApostado] = useState(0);
  const [totalGanho, setTotalGanho] = useState(0);
  const [giros, setGiros] = useState(0);
  const [maiorPremio, setMaiorPremio] = useState(0);

  const lucroLiquido = totalGanho - totalApostado;

  const taxaRetorno = useMemo(() => {
    if (totalApostado === 0) return 0;
    return Math.round((totalGanho / totalApostado) * 100);
  }, [totalApostado, totalGanho]);

  function diminuirAposta() {
    setAposta((valor) => Math.max(apostaMinima, valor - passoAposta));
  }

  function aumentarAposta() {
    setAposta((valor) => Math.min(apostaMaxima, valor + passoAposta));
  }

  function apostaMaximaHandler() {
    setAposta(apostaMaxima);
  }

  function resetarSessaoVisual() {
    setAposta(100);
    setUltimoPremio(0);
    setMensagem("Sessão reiniciada.");
    setLinhasAtivas([]);
    setDetalhesPremio([]);
    setHistorico([]);
    setTotalApostado(0);
    setTotalGanho(0);
    setGiros(0);
    setMaiorPremio(0);
    setGrade(gradeInicial);
    setGirando(false);
  }

  function resetarTudo() {
    resetarTudoGlobal();
    resetarSessaoVisual();
  }

  function girar() {
    if (girando || saldo < aposta) return;

    setGirando(true);
    setMensagem("Girando...");
    setLinhasAtivas([]);
    setDetalhesPremio([]);
    setUltimoPremio(0);

    const novaGrade = gerarGrade();

    window.setTimeout(() => {
      const avaliacao = avaliarGrade(novaGrade, aposta);

      setGrade(novaGrade);
      setSaldo((valorAtual) => valorAtual - aposta + avaliacao.premioTotal);
      registrarResultado(aposta, avaliacao.premioTotal);

      setUltimoPremio(avaliacao.premioTotal);
      setLinhasAtivas(avaliacao.linhasVencedoras);
      setDetalhesPremio(avaliacao.detalhes);
      setTotalApostado((valor) => valor + aposta);
      setTotalGanho((valor) => valor + avaliacao.premioTotal);
      setGiros((valor) => valor + 1);
      setMaiorPremio((valor) => Math.max(valor, avaliacao.premioTotal));

      const resultadoTexto =
        avaliacao.premioTotal > 0
          ? `Vitória: +${avaliacao.premioTotal.toLocaleString("pt-BR")}`
          : "Sem prêmio";

      setHistorico((anterior) => [
        { resultado: resultadoTexto, premio: avaliacao.premioTotal, aposta },
        ...anterior,
      ].slice(0, 6));

      setMensagem(
        avaliacao.premioTotal > 0
          ? `Você ganhou ${avaliacao.premioTotal.toLocaleString("pt-BR")} moedas.`
          : "Nenhuma combinação vencedora desta vez."
      );

      setGirando(false);
    }, 700);
  }

  function classesCelula(index: number, simbolo: string) {
    const linha = Math.floor(index / 3);
    const linhaVencedora = linhasAtivas.includes(linha);
    const info = simboloInfo[simbolo];

    return [
      "flex h-28 items-center justify-center rounded-2xl border text-4xl transition-all duration-300",
      info.bg,
      info.text,
      linhaVencedora
        ? "border-emerald-400/40 shadow-[0_0_25px_rgba(16,185,129,0.18)] scale-[1.02]"
        : "border-white/5",
      girando ? "animate-pulse" : "",
    ].join(" ");
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
              onClick={resetarTudo}
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
                <p className="text-sm text-fuchsia-300">Slot</p>
                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  Fortuna Neon
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-white/65 sm:text-base">
                  Protótipo premium de slot autoral com carteira global,
                  combinações vencedoras e painel de sessão.
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

            <div className="rounded-[28px] border border-white/10 bg-black/40 p-4">
              <div className="grid grid-cols-3 gap-3">
                {grade.map((item, index) => (
                  <div key={index} className={classesCelula(index, item)}>
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={girar}
                    disabled={girando || saldo < aposta}
                    className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {girando ? "Girando..." : "Girar agora"}
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

                  <button
                    onClick={apostaMaximaHandler}
                    disabled={girando}
                    className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-3 font-semibold text-fuchsia-200 transition hover:bg-fuchsia-400/15 disabled:opacity-50"
                  >
                    Aposta máxima
                  </button>
                </div>

                <div className="text-sm text-white/55">
                  Linhas pagas: 1, 2 e 3
                </div>
              </div>

              {saldo < aposta && !girando && (
                <p className="mt-4 text-sm text-rose-400">
                  Saldo insuficiente para essa aposta. Diminua a aposta ou
                  resete a carteira.
                </p>
              )}

              {detalhesPremio.length > 0 && (
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <p className="text-sm font-semibold text-emerald-300">
                    Combinações vencedoras
                  </p>
                  <div className="mt-2 space-y-1">
                    {detalhesPremio.map((detalhe, index) => (
                      <p key={index} className="text-sm text-white/80">
                        {detalhe}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/50">Informações</p>
              <h2 className="mt-2 text-2xl font-semibold">Painel do jogo</h2>

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
                <p className="text-sm text-white/50">Maior prêmio da sessão</p>
                <p className="mt-1 font-medium text-emerald-300">
                  {formatarMoedas(maiorPremio)}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/50">Atividade recente</p>
              <h3 className="mt-2 text-2xl font-semibold">Histórico</h3>

              <div className="mt-6 space-y-3">
                {historico.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/55">
                    Ainda não houve giros nesta sessão.
                  </div>
                ) : (
                  historico.map((item, index) => (
                    <div
                      key={`${item.resultado}-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white/80">{item.resultado}</p>
                        <span className="text-xs text-white/45">
                          Aposta: {formatarMoedas(item.aposta)}
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