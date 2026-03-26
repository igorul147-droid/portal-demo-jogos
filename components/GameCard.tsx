"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type GameCardProps = {
  titulo: string;
  categoria: string;
  descricao: string;
  rota: string;
  gradiente: string;
  botao: string;
};

export default function GameCard({
  titulo,
  categoria,
  descricao,
  rota,
  gradiente,
  botao,
}: GameCardProps) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const emailSalvo = window.localStorage.getItem("demo-wallet-email");
    if (!emailSalvo) {
      e.preventDefault();
      router.push("/login");
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className={`h-44 bg-gradient-to-br ${gradiente}`} />
      <div className="p-5">
        <p className="text-sm text-white/50">{categoria}</p>
        <h4 className="mt-2 text-2xl font-semibold">{titulo}</h4>
        <p className="mt-3 text-sm text-white/65">{descricao}</p>

        <Link
          href={rota}
          onClick={handleClick}
          className="mt-5 inline-block rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
        >
          {botao}
        </Link>
      </div>
    </article>
  );
}
