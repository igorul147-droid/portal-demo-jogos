"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Link from "next/link";
import {
  findAccountByEmail,
  normalizeEmail,
  registrarEmailRecuperacao,
} from "@/lib/authStorage";

export default function LoginPage() {
  const router = useRouter();
  const { setNomeUsuario } = useDemoWallet();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [mensagemRecuperacao, setMensagemRecuperacao] = useState("");
  const [enviandoRecuperacao, setEnviandoRecuperacao] = useState(false);

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
      const conta = findAccountByEmail(email);

      if (conta && conta.senha === senha) {
        setNomeUsuario(conta.nome);
        window.localStorage.setItem("demo-wallet-nome", conta.nome);
        window.localStorage.setItem("demo-wallet-email", conta.email);
        window.localStorage.setItem("demo-wallet-cpf", conta.cpf);
        window.localStorage.setItem("demo-wallet-data-nascimento", conta.dataNascimento);
        setCarregando(false);
        router.push("/");
      } else {
        setErro("Email ou senha incorretos");
        setCarregando(false);
      }
    }, 800);
  }

  function handleRecuperacao(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setMensagemRecuperacao("");

    const emailNormalizado = normalizeEmail(emailRecuperacao);

    if (!emailNormalizado.includes("@")) {
      setErro("Informe um email valido para recuperar a conta");
      return;
    }

    const conta = findAccountByEmail(emailNormalizado);

    if (!conta) {
      setErro("Nao encontramos conta para este email");
      return;
    }

    setEnviandoRecuperacao(true);

    fetch("/api/auth/recovery/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailNormalizado }),
    })
      .then(async (response) => {
        const data = (await response.json()) as {
          ok: boolean;
          sent?: boolean;
          provider?: "resend" | "mock";
          message?: string;
        };

        if (!response.ok || !data.ok) {
          throw new Error(data.message ?? "Falha ao solicitar recuperacao");
        }

        registrarEmailRecuperacao(emailNormalizado);
        setMensagemRecuperacao(
          data.provider === "resend"
            ? "Email de recuperacao enviado com sucesso. Verifique sua caixa de entrada e spam."
            : "Recuperacao registrada em modo mock. Configure RESEND_API_KEY para envio real."
        );
        setEmailRecuperacao("");
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Nao foi possivel enviar o email de recuperacao";
        setErro(message);
      })
      .finally(() => {
        setEnviandoRecuperacao(false);
      });
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
            <button
              type="button"
              onClick={() => setMostrarRecuperacao(!mostrarRecuperacao)}
              className="text-amber-400 hover:text-amber-300 transition mb-2 block w-full"
            >
              Esqueci minha senha
            </button>
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-amber-400 hover:text-amber-300 transition">
              Cadastre-se agora
            </Link>
          </div>

          {/* Seção de Recuperação */}
          {mostrarRecuperacao && (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="mb-4 text-lg font-semibold text-white">Recuperar Conta</h3>

              <form onSubmit={handleRecuperacao} className="space-y-4">
                <p className="text-sm text-white/70">
                  Informe seu email. Vamos enviar uma mensagem padrao de recuperacao da conta.
                </p>
                <input
                  type="email"
                  value={emailRecuperacao}
                  onChange={(e) => setEmailRecuperacao(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                />
                <button
                  type="submit"
                  disabled={enviandoRecuperacao}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition hover:scale-[1.02]"
                >
                  {enviandoRecuperacao ? "Enviando..." : "Enviar email de recuperacao"}
                </button>
              </form>

              {mensagemRecuperacao && (
                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  {mensagemRecuperacao}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}