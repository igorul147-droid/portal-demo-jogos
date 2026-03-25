import { Shield, CheckCircle2, Award, Lock } from 'lucide-react';

export default function CertificadoRNG() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 md:p-12">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left - Certificate */}
          <div className="flex flex-col items-center">
            <div className="relative h-64 w-52 rounded-2xl border-2 border-white/20 bg-gradient-to-br from-amber-50/10 to-orange-50/5 p-6 shadow-2xl">
              {/* Certificate Content */}
              <div className="flex h-full flex-col items-center justify-center text-center space-y-3">
                <Shield className="text-amber-200" size={40} />
                <p className="text-xs font-bold text-white/80 tracking-wider">CERTIFICADO DE</p>
                <p className="text-lg font-bold text-white">RNG AUDITADO</p>
                <div className="border-t border-white/20 pt-3 w-full">
                  <p className="text-xs text-white/60">eCOGRA Certified</p>
                  <p className="text-xs text-white/60 font-medium">Nº. 2024-DM-001</p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-white/60 max-w-xs">
              Certificação válida até 31/12/2025
            </p>
          </div>

          {/* Right - Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Certificado RNG</h3>
              <p className="text-white/70">
                Nossa plataforma passa por auditorias regulares independentes para garantir a integridade e aleatoriedade completa dos jogos.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-white">Gerador Aleatório Certificado</p>
                  <p className="text-sm text-white/60">Auditado por eCOGRA e UTG</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Lock className="text-sky-400 shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-white">Criptografia de Nível Militar</p>
                  <p className="text-sm text-white/60">Proteção de dados com TLS 1.3</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Award className="text-yellow-400 shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-white">Conformidade Regulatória</p>
                  <p className="text-sm text-white/60">Segue padrões internacionais MGA</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
              <p className="text-sm text-white/80">
                <span className="font-semibold text-emerald-300">✓ Verificado:</span> Todos os resultados são registrados e auditáveis. Nenhuma manipulação possível.
              </p>
            </div>

            <a
              href="/termos#kyc"
              className="inline-block rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Saiba mais sobre segurança
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
