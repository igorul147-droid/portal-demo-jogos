"use client";

import { useDemoWallet } from "@/components/DemoWalletProvider";
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

function formatarMoedas(valor: number) {
  return `${valor.toLocaleString("pt-BR")} moedas`;
}

type PortalHeaderProps = {
  mostrarMenu?: boolean;
};

export default function PortalHeader({
  mostrarMenu = true,
}: PortalHeaderProps) {
  const { saldo, nomeUsuario, resetarTudoGlobal } = useDemoWallet();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white font-bold text-black shrink-0">
            D
          </div>
          <div className="hidden sm:block">
            <p className="text-sm text-white/60">Portal Demo</p>
            <p className="text-lg font-semibold">BetClean</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        {mostrarMenu && (
          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/" className="text-sm text-white/70 transition hover:text-white">
              Início
            </Link>
            <Link href="/#catalogo" className="text-sm text-white/70 transition hover:text-white">
              Jogos
            </Link>
            <Link href="/#ranking" className="text-sm text-white/70 transition hover:text-white">
              Ranking
            </Link>
            <Link href="/carteira" className="text-sm text-white/70 transition hover:text-white">
              Carteira
            </Link>
            <Link href="/perfil" className="text-sm text-white/70 transition hover:text-white">
              Perfil
            </Link>
            <Link href="/cadastro" className="text-sm text-white/70 transition hover:text-white">
              Cadastro
            </Link>
          </nav>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {nomeUsuario && nomeUsuario !== "Jogador Demo" ? (
            <>
              {/* Logged In State */}
              <div className="hidden lg:block rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                Olá, {nomeUsuario}
              </div>

              <div className="hidden sm:block rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                Saldo demo: {formatarMoedas(saldo)}
              </div>

              <Link
                href="/carteira"
                className="hidden sm:block rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                💳 Carteira
              </Link>

              <button
                onClick={resetarTudoGlobal}
                className="hidden sm:block rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Resetar
              </button>
            </>
          ) : (
            <>
              {/* Not Logged In State - Auth Buttons */}
              <Link
                href="/login"
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/cadastro"
                className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Cadastrar
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          {mostrarMenu && (
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="lg:hidden rounded-lg p-2 text-white/70 hover:bg-white/10 transition"
            >
              {menuAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mostrarMenu && menuAberto && (
        <div className="border-t border-white/10 bg-black/50 backdrop-blur lg:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            <Link
              href="/"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-4 py-2 text-white/70 hover:bg-white/10 transition"
            >
              Início
            </Link>
            <Link
              href="/#catalogo"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-4 py-2 text-white/70 hover:bg-white/10 transition"
            >
              Jogos
            </Link>
            <Link
              href="/#ranking"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-4 py-2 text-white/70 hover:bg-white/10 transition"
            >
              Ranking
            </Link>
            <Link
              href="/perfil"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-4 py-2 text-white/70 hover:bg-white/10 transition"
            >
              Perfil
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-4 py-2 text-white/70 hover:bg-white/10 transition"
            >
              Cadastro
            </Link>

            <div className="border-t border-white/10 my-4" />

            <div className="px-4 py-2">
              <p className="text-xs text-white/50 mb-2">Saldo</p>
              <p className="text-sm font-medium text-emerald-300">{formatarMoedas(saldo)}</p>
            </div>

            <button
              onClick={() => {
                resetarTudoGlobal();
                setMenuAberto(false);
              }}
              className="rounded-lg px-4 py-2 text-white/70 hover:bg-white/10 transition text-left"
            >
              Resetar Tudo
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}