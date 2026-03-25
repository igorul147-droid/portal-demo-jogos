'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ModalResponsavel() {
  const [isOpen, setIsOpen] = useState(false);
  const [aceito, setAceito] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou
    const jaAceito = window.localStorage.getItem('demo-modal-responsavel-aceito');
    if (!jaAceito) {
      setIsOpen(true);
    }
  }, []);

  function handleAceitar() {
    window.localStorage.setItem('demo-modal-responsavel-aceito', 'true');
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 shadow-2xl md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-amber-400/10 p-3">
              <AlertCircle className="text-amber-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Jogo Responsável</h2>
              <p className="mt-1 text-sm text-white/60">Por favor, leia com atenção</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg bg-white/5 p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="mb-2 font-semibold text-white flex items-center gap-2">
              <span className="text-lg">18+</span>
              Você é maior de idade?
            </h3>
            <p className="text-sm text-white/70">
              Este é um portal de jogos demo. Apenas maiores de 18 anos podem acessar.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="mb-2 font-semibold text-white flex items-center gap-2">
              <span className="text-lg">💰</span>
              Demo - Sem Dinheiro Real
            </h3>
            <p className="text-sm text-white/70">
              Este é um simulador educacional. Não há envolvimento de dinheiro real, débito ou crédito.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="mb-2 font-semibold text-white flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Jogo Responsável
            </h3>
            <p className="text-sm text-white/70">
              Se você ou alguém próximo sofre com problemas de jogo, procure ajuda profesional imediatamente.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
            <p className="text-sm text-white/70">
              <span className="font-semibold text-emerald-300">Ajuda Disponível:</span> Ligue para o Centro de Apoio ao Jogador (0800-AJUDA-JG) ou acesse nossa seção de{' '}
              <Link href="/termos#responsavel" className="text-emerald-400 underline hover:text-emerald-300">
                Jogo Responsável
              </Link>
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4">
          <input
            type="checkbox"
            id="responsavel"
            checked={aceito}
            onChange={(e) => setAceito(e.target.checked)}
            className="h-5 w-5 cursor-pointer rounded border-white/30 bg-white/5"
          />
          <label htmlFor="responsavel" className="flex-1 cursor-pointer text-sm text-white/70">
            Entendi e aceito os termos de jogo responsável. Sou maior de 18 anos.
          </label>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAceitar}
            disabled={!aceito}
            className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Entendi e vou jogar responsavelmente
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-4 text-center text-xs text-white/50">
          Política completa em{' '}
          <Link href="/termos" className="text-white/70 underline hover:text-white">
            Termos de Serviço
          </Link>
        </p>
      </div>
    </div>
  );
}
