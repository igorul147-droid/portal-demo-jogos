"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import PortalHeader from "@/components/PortalHeader";

export default function OperacaoAcessoPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/operacao");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/operacao");
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({ error: "Falha de autenticação." }))) as { error?: string };
        setError(payload.error || "Falha de autenticação.");
        setLoading(false);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Erro ao criar sessão admin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#050d1b_0%,#020712_100%)] text-white">
      <PortalHeader />

      <section className="mx-auto flex min-h-[72vh] max-w-md items-center px-6 py-10">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Acesso admin</p>
          <h1 className="mt-3 text-3xl font-black text-white">Entrar na Operação</h1>
          <p className="mt-3 text-sm text-white/65">Informe o token administrativo para criar uma sessão segura do painel NOC.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Token admin"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-cyan-300/30 focus:outline-none"
            />
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-2xl border border-cyan-300/30 bg-cyan-300/15 px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Validando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs uppercase tracking-[0.14em] text-white/60 hover:text-white">
              Voltar para início
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
