"use client";

import { useDemoWallet } from "@/components/DemoWalletProvider";
import { Menu, X } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function formatarMoedas(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type PortalHeaderProps = {
  mostrarMenu?: boolean;
};

const LINKS_PRINCIPAIS = [
  { href: '/', label: 'Início' },
  { href: '/jogos/catalogo', label: 'Jogos' },
  { href: '/esportes', label: 'Esportes' },
];

const LINKS_SECUNDARIOS = [
  { href: '/analise', label: 'Análise' },
  { href: '/operacao', label: 'Operação' },
  { href: '/referencia', label: 'Referência' },
  { href: '/carteira', label: 'Carteira' },
  { href: '/suporte', label: 'Suporte' },
  { href: '/perfil', label: 'Perfil' },
];

const LINKS_MOBILE = [
  ...LINKS_PRINCIPAIS,
  ...LINKS_SECUNDARIOS,
];

const MENU_MOBILE_ID = "portal-menu-mobile";
const SUBMENU_LATERAL_ID = "portal-submenu-lateral";

function subscribeAuth(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

function getAuthSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("demo-wallet-email") ?? "";
}

export default function PortalHeader({
  mostrarMenu = true,
}: PortalHeaderProps) {
  const { saldo, nomeUsuario } = useDemoWallet();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [submenuLateralAberto, setSubmenuLateralAberto] = useState(false);
  const emailLogado = useSyncExternalStore(subscribeAuth, getAuthSnapshot, () => "");
  const isLogado = Boolean(emailLogado);

  function fecharMenus() {
    setMenuAberto(false);
    setSubmenuLateralAberto(false);
  }

  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={fecharMenus}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 font-black text-black shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.35)]">
            BC
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold">BetClean</p>
            <p className="text-xs text-white/50">Plataforma Premium de Jogos</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        {mostrarMenu && (
          <nav className="hidden items-center gap-6 lg:flex">
            {LINKS_PRINCIPAIS.map((item) => {
              const ativo = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition ${ativo ? 'text-white' : 'text-white/70 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setSubmenuLateralAberto((prev) => !prev)}
              className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition ${submenuLateralAberto ? 'border-amber-300/40 bg-amber-300/15 text-amber-100' : 'border-white/15 bg-white/5 text-white/75 hover:border-white/30 hover:text-white'}`}
              aria-label="Abrir subnavegação lateral"
              aria-expanded={submenuLateralAberto}
              aria-controls={SUBMENU_LATERAL_ID}
            >
              Mais
            </button>
          </nav>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isLogado ? (
            <>
              {/* Logged In State */}
              <div className="hidden lg:block rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                Olá, {nomeUsuario}
              </div>

              <div className="hidden sm:block rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                💰 Saldo: {formatarMoedas(saldo)}
              </div>
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
              type="button"
              onClick={() => {
                setSubmenuLateralAberto(false);
                setMenuAberto(!menuAberto);
              }}
              className="lg:hidden rounded-lg p-2 text-white/70 hover:bg-white/10 transition"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
              aria-controls={MENU_MOBILE_ID}
            >
              {menuAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mostrarMenu && menuAberto && (
        <div id={MENU_MOBILE_ID} className="border-t border-white/10 bg-black/50 backdrop-blur lg:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {LINKS_MOBILE.map((item) => {
              const ativo = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={fecharMenus}
                  className={`rounded-lg px-4 py-2 transition ${ativo ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10'}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/cadastro"
              onClick={fecharMenus}
              className="rounded-lg px-4 py-2 text-white/70 hover:bg-white/10 transition"
            >
              Cadastro
            </Link>

            <div className="border-t border-white/10 my-4" />

            <div className="px-4 py-2">
              <p className="text-xs text-white/50 mb-2">Saldo</p>
              <p className="text-sm font-medium text-emerald-300">{formatarMoedas(saldo)}</p>
            </div>
          </nav>
        </div>
      )}

      {mostrarMenu && submenuLateralAberto && (
        <>
          <button
            type="button"
            onClick={() => setSubmenuLateralAberto(false)}
            className="fixed inset-0 z-40 hidden bg-black/55 backdrop-blur-[2px] lg:block"
            aria-label="Fechar subnavegação"
          />

          <aside id={SUBMENU_LATERAL_ID} className="fixed left-0 top-20 z-50 hidden h-[calc(100dvh-5rem)] w-[288px] overflow-y-auto border-r border-violet-500/25 bg-[#efedf6] px-3 py-3 text-[#2f1f63] shadow-[0_22px_45px_rgba(7,4,20,0.38)] lg:block">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-sm font-semibold tracking-wide">Navegação</p>
              <button
                type="button"
                onClick={() => setSubmenuLateralAberto(false)}
                className="rounded-md bg-[#ddd8ef] p-1 text-[#5a49a3] transition hover:bg-[#d3cdea]"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {LINKS_SECUNDARIOS.map((item) => {
                const ativo = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSubmenuLateralAberto(false)}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${ativo ? 'border-[#4d39a8] bg-[#4d39a8] text-white shadow-[0_8px_18px_rgba(77,57,168,0.25)]' : 'border-[#c9c0e8] bg-[#f7f4ff] text-[#2f1f63] hover:bg-[#eee7ff]'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
