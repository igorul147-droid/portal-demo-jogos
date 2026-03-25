"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import StatsCard from "@/components/StatsCard";

function formatarMoedas(valor: number) {
  return `${valor.toLocaleString("pt-BR")} moedas`;
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
  const { saldo, setSaldo, resetarTudoGlobal, registrarResultado } = useDemoWallet();

  // Estados do jogo
  const [aposta, setAposta] = useState(100);
  const [emVoo, setEmVoo] = useState(false);
  const [multiplicador, setMultiplicador] = useState(1.0);
  const [crashValor, setCrashValor] = useState(0);
  const [ultimoCash, setUltimoCash] = useState(0);
  const [mensagem, setMensagem] = useState("Prepare seu avião para decolar");
  const [historicoVoos, setHistoricoVoos] = useState<
    { crash: number; resultado: "ganhou" | "perdeu" | "nao-sacou" }[]
  >([]);
  const [aviaoSacando, setAviaoSacando] = useState(false);
  const [posicaoAviao, setPosicaoAviao] = useState(0);;
  
  // Estatísticas
  const [totalApostado, setTotalApostado] = useState(0);
  const [totalGanho, setTotalGanho] = useState(0);
  const [voos, setVoos] = useState(0);
  const [taxaRetorno, setTaxaRetorno] = useState(0);
  
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

    setEmVoo(true);
    jaSacouRef.current = false;
    setMultiplicador(1.0);
    setUltimoCash(0);
    setMensagem("✈️ Avião decolando...");
    
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
          // Perdeu
          setSaldo((v) => v - apostaAtualRef.current);
          setMensagem(`💥 CRASH em ${crashEmX.toFixed(2)}x! Você perdeu ${formatarMoedas(apostaAtualRef.current)}`);
          setHistoricoVoos((h) => [
            { crash: crashEmX, resultado: "perdeu" as const },
            ...h,
          ].slice(0, 10));
        } else {
          // Sacou antes do crash
          const premio = Math.floor(apostaAtualRef.current * ultimoCash);
          const ganho = premio - apostaAtualRef.current;
          
          setSaldo((v) => v + ganho);
          setMensagem(
            `🎉 Sucesso! Sacou em ${ultimoCash.toFixed(2)}x e ganhou ${formatarMoedas(ganho)}`
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
        setTaxaRetorno(
          totalGanho > 0
            ? Math.round((totalGanho / (totalApostado + apostaAtualRef.current)) * 100)
            : 0
        );
      } else {
        setMultiplicador(Number(mulAtual.toFixed(2)));
      }
    }, 50);
  }

  function sacar() {
    if (!emVoo || jaSacouRef.current || multiplicador < 1.01) return;

    jaSacouRef.current = true;
    
    // Para o intervalo de crescimento
    if (vooIntervalRef.current) clearInterval(vooIntervalRef.current);

    // Calcula ganho
    const valorSaque = multiplicador;
    const premio = Math.floor(apostaAtualRef.current * valorSaque);
    const ganho = premio - apostaAtualRef.current;

    // Inicia animação de saque
    setAviaoSacando(true);
    setPosicaoAviao(0);

    // Anima o avião subindo por 1.5 segundos
    const animacaoInterval = setInterval(() => {
      setPosicaoAviao((p) => {
        if (p >= 100) {
          clearInterval(animacaoInterval);
          return 100;
        }
        return p + 3;
      });
    }, 20);

    // Após a animação, finaliza o jogo
    setTimeout(() => {
      setSaldo((v) => v + ganho);
      setUltimoCash(valorSaque);
      setMensagem(
        `🎉 Sucesso! Sacou em ${valorSaque.toFixed(2)}x e ganhou ${formatarMoedas(ganho)}`
      );
      setHistoricoVoos((h) => [
        { crash: crashValor, resultado: "ganhou" as const },
        ...h,
      ].slice(0, 10));

      setTotalGanho((t) => t + premio);
      setTotalApostado((t) => t + apostaAtualRef.current);
      setVoos((v) => v + 1);
      setTaxaRetorno(
        totalGanho > 0
          ? Math.round((totalGanho / (totalApostado + apostaAtualRef.current)) * 100)
          : 0
      );

      registrarResultado(apostaAtualRef.current, premio);
      setEmVoo(false);
      setAviaoSacando(false);
    }, 1500);
  }

  function resetarSessao() {
    if (vooIntervalRef.current) clearInterval(vooIntervalRef.current);
    resetarTudoGlobal();
    setAposta(100);
    setEmVoo(false);
    setMultiplicador(1.0);
    setUltimoCash(0);
    setMensagem("Sessão reiniciada");
    setHistoricoVoos([]);
    setTotalApostado(0);
    setTotalGanho(0);
    setVoos(0);
    setTaxaRetorno(0);
  }

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (vooIntervalRef.current) clearInterval(vooIntervalRef.current);
    };
  }, []);

  const lucroLiquido = totalGanho - totalApostado;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
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

            <button
              onClick={resetarSessao}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Resetar
            </button>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          {/* Game Area */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            {/* Título */}
            <div className="mb-8">
              <p className="text-sm text-amber-300">Jogo de Aviação</p>
              <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
                <span className="text-4xl">✈️</span>
                Aviator
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/65 sm:text-base">
                Assista o avião decolar e sacar antes do crash. Quanto mais alto voa, maior o ganho!
              </p>
            </div>

            {/* Display do Multiplicador - Principal */}
            <div className="rounded-[28px] border border-white/10 bg-black/40 p-8 mb-8 relative overflow-hidden">
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

                {/* Status */}
                <p className="mt-8 text-sm uppercase tracking-[0.25em] font-semibold">
                  {emVoo ? (
                    <span className="text-emerald-300">🟢 Em voo</span>
                  ) : jaSacouRef.current && ultimoCash > 0 ? (
                    <span className="text-emerald-300">✓ Sacou em {ultimoCash.toFixed(2)}x</span>
                  ) : (
                    <span className="text-white/60">🔴 Pronto para decolar</span>
                  )}
                </p>

                {/* Barra de Progresso */}
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

                {/* Mensagem */}
                <p className="mt-6 text-sm text-white/80 font-medium h-6">
                  {mensagem}
                </p>
              </div>
            </div>

            {/* Controles */}
            <div className="space-y-4">
              {/* Configuração de Aposta */}
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

              {/* Botões de Ação */}
              <div className="flex gap-3">
                {!emVoo ? (
                  <button
                    onClick={iniciarVoo}
                    disabled={saldo < aposta}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 font-bold text-lg text-black transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    🚀 DECOLAR
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
                    💰 SACAR {ultimoCash > 0 ? `${ultimoCash.toFixed(2)}x` : ""}
                  </button>
                )}
              </div>

              {saldo < aposta && !emVoo && (
                <p className="text-sm text-rose-400 text-center">
                  ⚠️ Saldo insuficiente! Resete ou reduza a aposta
                </p>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <aside className="space-y-6">
            {/* Panel 1: Estatísticas da Sessão */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/50">Status da Sessão</p>
              <h2 className="mt-2 text-2xl font-semibold">Estatísticas</h2>

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

            {/* Panel 2: Histórico de Voos */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/50">Histórico</p>
              <h3 className="mt-2 text-2xl font-semibold">Últimos voos</h3>

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
                        {voo.resultado === "ganhou" ? "✓ Win" : voo.resultado === "perdeu" ? "✗ Loss" : "−"}
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
