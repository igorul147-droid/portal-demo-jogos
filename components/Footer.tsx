import { Heart, Shield, FileText, Phone, Code, Mail, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 font-bold text-black">
              D
            </div>
            <p className="text-sm text-white/70">
              BetClean - Plataforma Premium de Jogos com Segurança 24/7 e Suporte Profissional.
            </p>
            <div className="flex gap-3">
              <a href="#" className="rounded-lg bg-white/5 p-2 text-white/60 transition hover:text-white hover:bg-white/10">
                <Code size={18} />
              </a>
              <a href="#" className="rounded-lg bg-white/5 p-2 text-white/60 transition hover:text-white hover:bg-white/10">
                <Mail size={18} />
              </a>
              <a href="#" className="rounded-lg bg-white/5 p-2 text-white/60 transition hover:text-white hover:bg-white/10">
                <Zap size={18} />
              </a>
            </div>
          </div>

          {/* Links Legais */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Informações</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/termos" className="transition hover:text-white">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link href="/termos#politica" className="transition hover:text-white">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos#kyc" className="transition hover:text-white">
                  Verificação de Identidade
                </Link>
              </li>
              <li>
                <Link href="/termos#responsavel" className="transition hover:text-white">
                  Jogo Responsável
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Suporte</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="mailto:contato@betclean.com" className="transition hover:text-white">
                  contato@betclean.com
                </a>
              </li>
              <li>
                <a href="tel:+5511999999999" className="flex items-center gap-2 transition hover:text-white">
                  <Phone size={14} />
                  +55 11 99999-9999
                </a>
              </li>
              <li>
                <span className="text-white">Chat 24/7</span>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Centro de Ajuda
                </a>
              </li>
            </ul>
          </div>

          {/* Certificações */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Certificações</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 p-3">
                <Shield size={18} className="text-emerald-400" />
                <div className="text-sm">
                  <p className="font-medium text-white">RNG Auditado</p>
                  <p className="text-xs text-white/50">eCOGRA Certified</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 p-3">
                <FileText size={18} className="text-amber-400" />
                <div className="text-sm">
                  <p className="font-medium text-white">Licenciado</p>
                  <p className="text-xs text-white/50">MGA (Demo)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Heart size={16} className="text-rose-400" />
            <p>
              © {currentYear} BetClean. Todos os direitos reservados. Jogue responsavelmente.
            </p>
          </div>

          <div className="flex gap-4 text-xs text-white/50">
            <span>Status: 🟢 Online</span>
            <span>•</span>
            <span>Versão: 1.0.0</span>
            <span>•</span>
            <span>API: v1</span>
          </div>
        </div>

        {/* Aviso Responsável */}
        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-white/70">
          <p className="mb-2 font-semibold text-amber-300">⚠️ Aviso Responsável</p>
          <p>
            Este é um portal DEMO. Não há dinheiro real envolvido. Os jogos são simulações educacionais apenas. 
            Se você sofre com problemas de jogo, procure ajuda profissional. Maiores de 18 anos apenas.
          </p>
        </div>
      </div>
    </footer>
  );
}
