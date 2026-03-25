"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setNomeUsuario } = useDemoWallet();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!email.includes("@")) {
      setErro("Email inválido");
      return;
    }

    if (senha.length < 6) {
      setErro("Senha inválida");
      return;
    }

    setCarregando(true);

    // Simula delay de processamento
    setTimeout(() => {
      // Busca no localStorage
      const nomeArmazenado = window.localStorage.getItem("demo-wallet-nome");
      const emailArmazenado = window.localStorage.getItem("demo-wallet-email");
      const senhaArmazenada = window.localStorage.getItem("demo-wallet-senha");

      // Para este demo, aceita qualquer email/senha válida
      // Em produção, faria validação contra backend
      if (emailArmazenado && email === emailArmazenado) {
        if (nomeArmazenado) {
          setNomeUsuario(nomeArmazenado);
        }
        setCarregando(false);
        router.push("/");
      } else {
        setErro("Email ou senha incorretos");
        setCarregando(false);
      }
    }, 800);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black font-bold text-lg">
                D
              </div>
            </div>
            <h1 className="text-3xl font-bold">BetClean</h1>
            <p className="mt-2 text-white/60">Acesse sua conta e continue jogando</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            {erro && (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                {erro}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-white/70">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="mb-2 block text-sm text-white/70">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            {/* Botão Login */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-white/60">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-amber-400 hover:text-amber-300 transition">
              Cadastre-se agora
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
