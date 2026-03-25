"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const { setNomeUsuario, setSaldo } = useDemoWallet();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Formata CPF com pontos e hífen
  function formatarCPF(valor: string) {
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
    if (apenasNumeros.length <= 3) return apenasNumeros;
    if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`;
  }

  function handleCPFChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(formatarCPF(e.target.value));
  }

  function validarFormulario() {
    if (!nome.trim()) {
      setErro("Nome é obrigatório");
      return false;
    }

    if (nome.trim().length < 3) {
      setErro("Nome deve ter pelo menos 3 caracteres");
      return false;
    }

    if (!email.includes("@")) {
      setErro("Email inválido");
      return false;
    }

    const cpfApenasNumeros = cpf.replace(/\D/g, "");
    if (cpfApenasNumeros.length !== 11) {
      setErro("CPF deve ter exatamente 11 dígitos");
      return false;
    }

    if (!dataNascimento) {
      setErro("Data de nascimento é obrigatória");
      return false;
    }

    // Validar idade mínima (18 anos)
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    if (idade < 18) {
      setErro("Você deve ter pelo menos 18 anos");
      return false;
    }

    if (senha.length < 6) {
      setErro("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem");
      return false;
    }

    return true;
  }

  function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);

    // Simula delay de processamento
    setTimeout(() => {
      // Registra o novo usuário
      setNomeUsuario(nome);
      setSaldo(10000); // Saldo inicial de 10.000 moedas

      // Salva no localStorage para persistência
      window.localStorage.setItem("demo-wallet-nome", nome);
      window.localStorage.setItem("demo-wallet-email", email);
      window.localStorage.setItem("demo-wallet-cpf", cpf.replace(/\D/g, ""));
      window.localStorage.setItem("demo-wallet-data-nascimento", dataNascimento);
      window.localStorage.setItem("demo-wallet-saldo", "10000");

      setCarregando(false);
      router.push("/");
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
            <p className="mt-2 text-white/60">Crie sua conta e comece a jogar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleCadastro} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            {erro && (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                {erro}
              </div>
            )}

            {/* Nome */}
            <div>
              <label className="mb-2 block text-sm text-white/70">Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome aqui"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

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

            {/* CPF */}
            <div>
              <label className="mb-2 block text-sm text-white/70">CPF (11 dígitos)</label>
              <input
                type="text"
                value={cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="mb-2 block text-sm text-white/70">Data de nascimento</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
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
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="mb-2 block text-sm text-white/70">Confirmar senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita sua senha"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            {/* Botão Cadastro */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? "Criando conta..." : "Criar conta"}
            </button>

            {/* Link para login */}
            <div className="pt-2 text-center text-sm text-white/60">
              Já tem conta?{" "}
              <Link href="/login" className="text-amber-400 transition hover:text-amber-300">
                Entre aqui
              </Link>
            </div>
          </form>

          {/* Rodapé */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/50">
            <p>🎮 Demo com saldo inicial de <span className="text-emerald-300">10.000 moedas</span></p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
