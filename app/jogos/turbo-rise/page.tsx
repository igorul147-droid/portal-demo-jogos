"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import StatsCard from "@/components/StatsCard";
import { formatBRL } from "@/lib/currency";

function formatarMoedas(valor: number) {
  return formatBRL(valor);
}

function gerarCrashMultiplicador() {
  const rnd = Math.random();
  
  // 40% chance: crash entre 1.01x e 1.50x (cedo)
  if (rnd < 0.40) {
    return Number((Math.random() * 0.49 + 1.01).toFixed(2));
  }
  
  // 35% chance: crash entre 1.50x e 5.00x (médio)
  if (rnd < 0.75) {
    return Number((Math.random() * 3.5 + 1.5).toFixed(2));
  }
  
  // 25% chance: crash entre 5.00x e 100x (raro, apostar grande risco!)
  return Number((Math.random() * 95 + 5).toFixed(2));
}

export default function AviatorPage() {
  const { saldo, setSaldo, registrarResultado } = useDemoWallet();

  const router = useRouter();
  useEffect(() => {
    const email = window.localStorage.getItem("demo-wallet-email");
    if (!email) router.push("/login");
  }, [router]);

  // Estados do jogo
  const [aposta, setAposta] = useState(100);
  const [emVoo, setEmVoo] = useState(false);
  const [multiplicador, setMultiplicador] = useState(1.0);
  const [crashValor, setCrashValor] = useState(0);
  const [ultimoCash, setUltimoCash] = useState(0);
  const [mensagem, setMensagem] = useState("Mesa pronta para abertura de voo.");
  const [historicoVoos, setHistoricoVoos] = useState<
    { crash: number; resultado: "ganhou" | "perdeu" | "nao-sacou" }[]
  >([]);
  const [aviaoSacando, setAviaoSacando] = useState(false);
  
  // Estatísticas
  const [totalApostado, setTotalApostado] = useState(0);
  const [totalGanho, setTotalGanho] = useState(0);
  const [voos, setVoos] = useState(0);
  // Refs para controle
  const vooIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const jaSacouRef = useRef(false);
  const apostaAtualRef = useRef(aposta);

  useEffect(() => {
    apostaAtualRef.current = aposta;
  }, [aposta]);

  function diminuirAposta() {
    setAposta((v) => Math.max(50, v - 50));
  }

  function aumentarAposta() {
    setAposta((v) => Math.min(5000, v + 50));
  }

  function iniciarVoo() {
    if (emVoo || saldo < aposta) return;

    setSaldo((v) => v - aposta);
    setEmVoo(true);
    jaSacouRef.current = false;
    setMultiplicador(1.0);
    setUltimoCash(0);
    setMensagem("Voo aberto. Liquide a posição antes do crash.");
    
    const crashEmX = gerarCrashMultiplicador();
    setCrashValor(crashEmX);

    let mulAtual = 1.0;
    const incremento = 0.01;

    vooIntervalRef.current = setInterval(() => {
      mulAtual += incremento;

      if (mulAtual >= crashEmX) {
        // CRASH!
        if (vooIntervalRef.current) clearInterval(vooIntervalRef.current);
        
        setEmVoo(false);
        setMultiplicador(crashEmX);

        if (!jaSacouRef.current) {
          setMensagem(
            `Crash confirmado em ${crashEmX.toFixed(2)}x. Exposição encerrada em ${formatarMoedas(apostaAtualRef.current)}.`
          );
          setHistoricoVoos((h) => [
            { crash: crashEmX, resultado: "perdeu" as const },
            ...h,
          ].slice(0, 10));
        } else {
          const premio = Math.floor(apostaAtualRef.current * ultimoCash);
          setMensagem(
            `Liquidação confirmada em ${ultimoCash.toFixed(2)}x com crédito de ${formatarMoedas(premio)}.`
          );
          setHistoricoVoos((h) => [
            { crash: crashEmX, resultado: "ganhou" as const },
            ...h,
          ].slice(0, 10));
          
          setTotalGanho((t) => t + premio);
          registrarResultado(apostaAtualRef.current, premio);
        }

        setTotalApostado((t) => t + apostaAtualRef.current);
        setVoos((v) => v + 1);
      } else {
        setMultiplicador(Number(mulAtual.toFixed(2)));
      }
    }, 50);
  }

  function sacar() {
    if (!emVoo || jaSacouRef.current || multiplicador < 1.01) return;

    jaSacouRef.current = true;
    
    if (vooIntervalRef.current) clearInterval(vooIntervalRef.current);

    const valorSaque = multiplicador;
    const premio = Math.floor(apostaAtualRef.current * valorSaque);

    setAviaoSacando(true);

    setTimeout(() => {
      setSaldo((v) => v + premio);
      setUltimoCash(valorSaque);
      setMensagem(
        `Liquidação confirmada em ${valorSaque.toFixed(2)}x com crédito de ${formatarMoedas(premio)}.`
      );
      setHistoricoVoos((h) => [
        { crash: crashValor, resultado: "ganhou" as const },
        ...h,
      ].slice(0, 10));

      setTotalGanho((t) => t + premio);
      setTotalApostado((t) => t + apostaAtualRef.current);
      setVoos((v) => v + 1);

      registrarResultado(apostaAtualRef.current, premio);
      setEmVoo(false);
      setAviaoSacando(false);
    }, 1500);
  }

  function resetarSessao() {
    if (vooIntervalRef.current) clearInterval(vooIntervalRef.current);
    if (emVoo) return;
    setAposta(100);
    setEmVoo(false);
    setMultiplicador(1.0);
    setCrashValor(0);
    setUltimoCash(0);
    setMensagem("Painel operacional limpo.");
    setHistoricoVoos([]);
    setTotalApostado(0);
    setTotalGanho(0);
    setVoos(0);
    jaSacouRef.current = false;
  }

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (vooIntervalRef.current) clearInterval(vooIntervalRef.current);
    };
  }, []);

  const lucroLiquido = totalGanho - totalApostado;
  const taxaRetorno = useMemo(() => {
    if (totalApostado === 0) return 0;
    return Math.round((totalGanho / totalApostado) * 100);
  }, [totalApostado, totalGanho]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.12),_transparent_24%),#09090b] text-white">
      <PortalHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header do Jogo */}
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
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200">
              Risco dinâmico
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
              Liquidação manual
            </div>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div className="mb-8">
              <p className="text-sm text-amber-300">BetClean Originals • Flight Desk</p>
              <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
                <span className="text-4xl">✈️</span>
                Turbo Rise
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/65 sm:text-base">
                Mesa crash com liquidação em tempo real, exposição visível na carteira
                e leitura instantânea de multiplicador.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-amber-500/10 via-black/50 to-teal-400/10 p-8 mb-8 relative overflow-hidden">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/65">
                <span>Janela de saída manual</span>
                <span>Liquidação imediata após saque</span>
                <span>Risco progressivo</span>
              </div>
              <div className={`rounded-3xl border transition-all ${
                emVoo ? "border-amber-400/50 bg-gradient-to-br from-amber-500/20 via-orange-400/10 to-red-500/10 animate-pulse-glow" : "border-white/10 bg-white/5"
              } p-8 text-center relative min-h-[400px] flex flex-col items-center justify-center`}>
                
                {/* Avião com animação de saque */}
                {aviaoSacando ? (
                  <>
                    <div className="absolute top-20 text-7xl animate-aviao-subindo">
                      ✈️
                    </div>
                    <div className="absolute top-32 text-6xl font-black text-amber-300 animate-multiplicador-flutuando">
                      {ultimoCash.toFixed(2)}x
                    </div>
                  </>
                ) : (
                  <>
                    {/* Avião normal */}
                    <div className={`text-7xl mb-6 inline-block transition-all ${
                      emVoo ? "animate-bounce scale-110" : "scale-100"
                    }`}>
                      ✈️
                    </div>

                    {/* Multiplicador Grande e Destacado */}
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50 mb-3">
                        Multiplicador
                      </p>
                      <div className="text-8xl font-black tracking-tighter leading-none">
                        {multiplicador.toFixed(2)}
                        <span className="text-5xl text-amber-300">x</span>
                      </div>
                    </div>
                  </>
                )}

                <p className="mt-8 text-sm uppercase tracking-[0.25em] font-semibold">
                  {emVoo ? (
                    <span className="text-emerald-300">Em voo</span>
                  ) : jaSacouRef.current && ultimoCash > 0 ? (
                    <span className="text-emerald-300">Liquidado em {ultimoCash.toFixed(2)}x</span>
                  ) : (
                    <span className="text-white/60">Aguardando nova janela</span>
                  )}
                </p>

                {emVoo && crashValor > 0 && (
                  <div className="mx-auto mt-8 h-2 max-w-2xl overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 animate-pulse"
                      style={{
                        width: `${Math.min((multiplicador / (crashValor * 1.1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}

                <p className="mt-6 text-sm text-white/80 font-medium h-6">
                  {mensagem}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={diminuirAposta}
                    disabled={emVoo}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −50
                  </button>

                  <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white min-w-fit text-center">
                    {formatarMoedas(aposta)}
                  </div>

                  <button
                    onClick={aumentarAposta}
                    disabled={emVoo}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +50
                  </button>
                </div>

                <span className="text-xs text-white/50">
                  Aposta mín: {formatarMoedas(50)} | máx: {formatarMoedas(5000)}
                </span>
              </div>

              <div className="flex gap-3">
                {!emVoo ? (
                  <button
                    onClick={iniciarVoo}
                    disabled={saldo < aposta}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 font-bold text-lg text-black transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Abrir voo
                  </button>
                ) : (
                  <button
                    onClick={sacar}
                    disabled={jaSacouRef.current || multiplicador < 1.01}
                    className={`flex-1 rounded-2xl px-6 py-4 font-bold text-lg transition ${
                      jaSacouRef.current || multiplicador < 1.01
                        ? "bg-white/10 text-white/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-400 to-teal-500 text-black hover:scale-[1.02] hover:shadow-xl"
                    }`}
                  >
                    Liquidar agora
                  </button>
                )}
              </div>

              {saldo < aposta && !emVoo && (
                <p className="text-sm text-rose-400 text-center">
                  Saldo insuficiente para abrir a posição. Ajuste a entrada ou faça nova recarga.
                </p>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-white/50">Status da sessão</p>
                  <h2 className="mt-2 text-2xl font-semibold">Estatísticas</h2>
                </div>
                <button
                  onClick={resetarSessao}
                  disabled={emVoo}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                  Nova sessão
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <StatsCard label="Voos" value={String(voos)} />
                <StatsCard label="Taxa %" value={`${taxaRetorno}%`} />
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

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs text-white/50">Lucro líquido</p>
                  <p
                    className={`mt-2 text-lg font-bold ${
                      lucroLiquido >= 0 ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    {lucroLiquido >= 0 ? "+" : ""}
                    {formatarMoedas(lucroLiquido)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/50">Histórico</p>
              <h3 className="mt-2 text-2xl font-semibold">Últimas exposições</h3>

              <div className="mt-6 space-y-2 max-h-80 overflow-y-auto">
                {historicoVoos.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/55 text-center">
                    Nenhum voo realizado
                  </div>
                ) : (
                  historicoVoos.map((voo, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl border p-3 animate-slide-in-up flex items-center justify-between ${
                        voo.resultado === "ganhou"
                          ? "border-emerald-400/30 bg-emerald-400/10"
                          : voo.resultado === "perdeu"
                          ? "border-rose-400/30 bg-rose-400/10"
                          : "border-white/10 bg-black/30"
                      }`}
                    >
                      <span className="font-bold text-lg">
                        {voo.crash.toFixed(2)}x
                      </span>
                      <span className={`text-xs font-semibold ${
                        voo.resultado === "ganhou"
                          ? "text-emerald-300"
                          : voo.resultado === "perdeu"
                          ? "text-rose-300"
                          : "text-white/60"
                      }`}>
                        {voo.resultado === "ganhou" ? "Liquidado" : voo.resultado === "perdeu" ? "Crash" : "-"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>

      <Footer />
    </main>
  );
}
