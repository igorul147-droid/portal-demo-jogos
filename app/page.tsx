"use client";

import PortalHeader from "@/components/PortalHeader";
import GameCard from "@/components/GameCard";
import StatsCard from "@/components/StatsCard";
import UltimosGanhadores from "@/components/UltimosGanhadores";
import PromoAndBonus from "@/components/PromoAndBonus";
import ComoFunciona from "@/components/ComoFunciona";
import CertificadoRNG from "@/components/CertificadoRNG";
import Footer from "@/components/Footer";
import { useDemoWallet } from "@/components/DemoWalletProvider";

function formatarMoedas(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const jogos = [
  {
    titulo: "Fortuna Neon",
    categoria: "Slot",
    descricao:
      "Um caça-níquel autoral com visual futurista e efeitos vibrantes.",
    rota: "/jogos/fortuna-neon",
    gradiente: "from-fuchsia-500/30 via-violet-500/20 to-cyan-400/20",
    botao: "Jogar",
  },
  {
    titulo: "Aviator",
    categoria: "Aviação",
    descricao:
      "Assista o avião decolar e sacar antes do crash. Quanto mais alto voa, maior o ganho!",
    rota: "/jogos/turbo-rise",
    gradiente: "from-blue-400/30 via-cyan-500/20 to-purple-500/20",
    botao: "Jogar",
  },
  {
    titulo: "Orbit Wheel",
    categoria: "Roleta",
    descricao:
      "Uma roleta conceitual com interface limpa, giro instantâneo e sistema de premiação equilibrado.",
    rota: "/jogos/orbit-wheel",
    gradiente: "from-emerald-400/30 via-teal-500/20 to-sky-500/20",
    botao: "Jogar",
  },
];

export default function Home() {
  const {
    nomeUsuario,
    ranking,
    totalApostadoGlobal,
    totalGanhoGlobal,
    totalRodadasGlobal,
  } = useDemoWallet();

  const lucroGlobal = totalGanhoGlobal - totalApostadoGlobal;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <PortalHeader />

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center">
        <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
          Plataforma autoral com carteira integrada
        </span>

        <h2 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-6xl">
          Bem-vindo, {nomeUsuario}
        </h2>

        <p className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
          Seu portal já tem múltiplos jogos, saldo global, ranking local,
          perfil persistente e estatísticas compartilhadas.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href="/jogos/fortuna-neon"
            className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
          >
            Começar agora
          </a>

          <a
            href="#catalogo"
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Explorar jogos
          </a>
        </div>

        <div className="mt-14 grid w-full max-w-5xl gap-4 md:grid-cols-4">
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
      </section>

      <section id="catalogo" className="mx-auto max-w-7xl px-6 pb-16">
        {/* Jogos PG Soft */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">🎰 Jogos PG Soft</h2>
            <span className="text-sm text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
              Catálogo Premium
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard
              titulo="Sweet Bonanza"
              categoria="Slots"
              descricao="Slots com frutas doces e multiplicadores"
              rota="/jogos/sweet-bonanza"
              gradiente="from-pink-500/30 via-purple-500/20 to-orange-400/20"
              botao="Jogar"
            />
            <GameCard
              titulo="Mahjong Ways"
              categoria="Mahjong"
              descricao="Mahjong temático com 243 linhas"
              rota="/jogos/mahjong-ways"
              gradiente="from-blue-500/30 via-cyan-500/20 to-green-400/20"
              botao="Jogar"
            />
            <GameCard
              titulo="Fortune Tiger"
              categoria="Slots"
              descricao="Tigre da sorte com rodadas grátis"
              rota="/jogos/fortune-tiger"
              gradiente="from-yellow-500/30 via-orange-500/20 to-red-400/20"
              botao="Jogar"
            />
            <GameCard
              titulo="Gates of Olympus"
              categoria="Mitologia"
              descricao="Mitologia grega com Zeus"
              rota="/jogos/gates-olympus"
              gradiente="from-purple-500/30 via-blue-500/20 to-indigo-400/20"
              botao="Jogar"
            />
            <GameCard
              titulo="Wild West Gold"
              categoria="Western"
              descricao="Faroeste com jackpots progressivos"
              rota="/jogos/wild-west-gold"
              gradiente="from-amber-500/30 via-yellow-500/20 to-orange-400/20"
              botao="Jogar"
            />
            <GameCard
              titulo="Dragon Hatch"
              categoria="Fantasia"
              descricao="Dragões e ovos misteriosos"
              rota="/jogos/dragon-hatch"
              gradiente="from-green-500/30 via-emerald-500/20 to-teal-400/20"
              botao="Jogar"
            />
          </div>
        </div>

        {/* Jogos Originais BetClean */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">⚡ Jogos Originais</h2>
            <span className="text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
              100% Nativos
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard
              titulo="Mines"
              categoria="Estratégia"
              descricao="Revele gems, evite bombas e multiplique seus ganhos"
              rota="/jogos/mines"
              gradiente="from-red-500/30 via-orange-500/20 to-amber-400/20"
              botao="Jogar Agora"
            />
            <GameCard
              titulo="Tower"
              categoria="Desafio"
              descricao="Suba a torre escolhendo o bloco correto por andar"
              rota="/jogos/tower"
              gradiente="from-purple-500/30 via-indigo-500/20 to-blue-400/20"
              botao="Jogar Agora"
            />
            <GameCard
              titulo="Hi-Lo"
              categoria="Cartas"
              descricao="Adivinhe se a próxima carta é maior ou menor"
              rota="/jogos/hi-lo"
              gradiente="from-blue-500/30 via-cyan-500/20 to-sky-400/20"
              botao="Jogar Agora"
            />
            <GameCard
              titulo="Fortuna Neon"
              categoria="Slot"
              descricao="Slot machine neon com linhas de pagamento especiais"
              rota="/jogos/fortuna-neon"
              gradiente="from-fuchsia-500/30 via-violet-500/20 to-cyan-400/20"
              botao="Jogar Agora"
            />
            <GameCard
              titulo="Turbo Rise"
              categoria="Crash"
              descricao="Assista o avião decolar e saque antes do crash"
              rota="/jogos/turbo-rise"
              gradiente="from-blue-400/30 via-cyan-500/20 to-purple-500/20"
              botao="Jogar Agora"
            />
            <GameCard
              titulo="Orbit Wheel"
              categoria="Roleta"
              descricao="Roleta com multiplicadores e giro instantâneo"
              rota="/jogos/orbit-wheel"
              gradiente="from-emerald-400/30 via-teal-500/20 to-sky-500/20"
              botao="Jogar Agora"
            />
          </div>
        </div>
      </section>

      <section id="ranking" className="mx-auto max-w-7xl px-6 py-20 space-y-8">
        <UltimosGanhadores />

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/50">Competição</p>
          <h3 className="mt-2 text-2xl font-semibold">Ranking local</h3>

          <div className="mt-6 grid gap-3">
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
        </div>
      </section>

      <PromoAndBonus />

      <ComoFunciona />

      <CertificadoRNG />

      <Footer />
    </main>
  );
}