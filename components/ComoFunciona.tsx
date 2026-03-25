import { Dices, Zap, RotateCw } from 'lucide-react';

export default function ComoFunciona() {
  const jogos = [
    {
      id: 1,
      titulo: 'Fortuna Neon',
      categoria: 'Slot Machine',
      icone: Dices,
      como: [
        'Gire os 3 rolos com 9 posições cada',
        'Combine símbolos em 3 linhas de pagamento',
        'Símbolos especiais (Wildcard) substituem outros',
        'Ganhe automaticamente ao combinar 3+ símbolos iguais',
      ],
      dica: 'Os símbolos premium pagam mais! Foque em conseguir Diamantes e Coroas.',
    },
    {
      id: 2,
      titulo: 'Turbo Rise',
      categoria: 'Crash / Multiplicador',
      icone: Zap,
      como: [
        'Faça uma aposta entre 50 e 1.000 moedas',
        'O multiplicador começa em 1.00x e cresce continuamente',
        'Clique em "Encerrar" antes que ele caia para ganhar',
        'Se não clicar a tempo, perde a aposta',
      ],
      dica: 'Comece conservador e aumente conforme ganha confiança. O auto-cashout ajuda!',
    },
    {
      id: 3,
      titulo: 'Orbit Wheel',
      categoria: 'Roleta',
      icone: RotateCw,
      como: [
        'Escolha um prêmio de 2x até 12x antes de girar',
        'Clique em "Girar Roda" para começar',
        'A roda gira aleatoriamente (RNG certificado)',
        'Seu prêmio é multiplicado pelo valor selecionado',
      ],
      dica: 'Prêmios altos (8x, 12x) aparecem menos. Jogue com frequência!',
    },
  ];

  return (
    <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-20 space-y-16">
      <div>
        <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
          Tutorial
        </span>
        <h2 className="text-4xl font-bold sm:text-5xl">Como Funciona</h2>
        <p className="mt-4 max-w-2xl text-white/70">
          Entenda as regras de cada jogo e comece a jogar com confiança.
        </p>
      </div>

      {jogos.map((jogo) => {
        const Icon = jogo.icone;
        return (
          <div key={jogo.id} className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <Icon size={32} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-white/50">Jogo</p>
                <h3 className="text-3xl font-bold text-white">{jogo.titulo}</h3>
                <p className="text-white/60">{jogo.categoria}</p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h4 className="mb-4 font-semibold text-white">Passo a passo:</h4>
                <ol className="space-y-3">
                  {jogo.como.map((passo, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/80">
                        {i + 1}
                      </span>
                      <p className="text-white/80 leading-relaxed">{passo}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-emerald-300">
                  <span>💡</span>
                  Dica do Profissional
                </h4>
                <p className="leading-relaxed text-white/80">{jogo.dica}</p>

                <div className="mt-4 rounded-lg bg-emerald-400/10 p-3 text-xs text-white/70">
                  <p className="font-medium mb-1">ℹ️ Informação:</p>
                  <p>Use para praticar e entender as mecânicas dos jogos!</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* RTP Info */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h3 className="mb-6 text-2xl font-bold text-white flex items-center gap-2">
          📊 Transparência de RTP (Return to Player)
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-white/70 mb-4">
              O RTP (Return to Player) é a porcentagem teórica de todas as apostas que um jogo retorna aos jogadores a longo prazo. Todos os nossos RTPs são auditados e certificados.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/30">
                <span className="text-white/70">🎰 Slot Machines</span>
                <span className="text-emerald-300 font-semibold">96-98%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/30">
                <span className="text-white/70">⚡ Crash Games</span>
                <span className="text-emerald-300 font-semibold">97-99%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/30">
                <span className="text-white/70">🎡 Roleta</span>
                <span className="text-emerald-300 font-semibold">96%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/30">
                <span className="text-white/70">🀄 Mahjong</span>
                <span className="text-emerald-300 font-semibold">96.8%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
            <h4 className="mb-4 font-semibold text-emerald-300 flex items-center gap-2">
              <span>✅</span> Certificação
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-2">
                <span>🔐</span>
                <span>eCOGRA - Comitê Europeu de Órgãos Reguladores</span>
              </li>
              <li className="flex gap-2">
                <span>📜</span>
                <span>Auditoria anual por terceiros</span>
              </li>
              <li className="flex gap-2">
                <span>🎲</span>
                <span>RNG (Random Number Generator) verificado</span>
              </li>
              <li className="flex gap-2">
                <span>⚖️</span>
                <span>Conformidade com padrões internacionais</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
