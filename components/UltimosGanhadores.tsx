import { Trophy, Zap } from 'lucide-react';

// Simulação de últimas vitórias
const ultimasVitorias = [
  { id: 1, jogador: 'Luna', jogo: 'Turbo Rise', ganho: 4250, tempo: 'há 2 minutos' },
  { id: 2, jogador: 'Rafa', jogo: 'Orbit Wheel', ganho: 3800, tempo: 'há 5 minutos' },
  { id: 3, jogador: 'Kaio', jogo: 'Fortuna Neon', ganho: 5200, tempo: 'há 8 minutos' },
  { id: 4, jogador: 'Maya', jogo: 'Turbo Rise', ganho: 2950, tempo: 'há 12 minutos' },
  { id: 5, jogador: 'Você', jogo: 'Turbo Rise', ganho: 1500, tempo: 'há 15 minutos' },
];

function formatarMoedas(valor: number) {
  return `${valor.toLocaleString('pt-BR')} moedas`;
}

export default function UltimosGanhadores() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-400/10 p-2">
            <Trophy className="text-amber-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-white/50">Atividade em tempo real</p>
            <h3 className="text-2xl font-bold text-white">Últimas Vitórias</h3>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Ao vivo
        </span>
      </div>

      <div className="space-y-2">
        {ultimasVitorias.map((vitoria) => (
          <div
            key={vitoria.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4 transition hover:bg-black/60"
          >
            <div className="flex flex-1 items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm ${
                vitoria.id === 5 
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-black'
                  : 'bg-white/10 text-white'
              }`}>
                {vitoria.id === 5 ? '👤' : vitoria.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{vitoria.jogador}</p>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                    {vitoria.jogo}
                  </span>
                </div>
                <p className="text-xs text-white/50">{vitoria.tempo}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Zap className="text-amber-400" size={16} />
              <p className="font-semibold text-emerald-300">+{formatarMoedas(vitoria.ganho)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-center text-xs text-white/70">
        <p>Próxima atualização em 30 segundos • Demo com saldos simulados</p>
      </div>
    </div>
  );
}
