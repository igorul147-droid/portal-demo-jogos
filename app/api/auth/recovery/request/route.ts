import { NextResponse } from "next/server";
import { enviarEmailRecuperacao } from "@/lib/server/recoveryEmail";

type Payload = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, message: "Email invalido" },
        { status: 400 }
      );
    }

    const result = await enviarEmailRecuperacao(email);

    return NextResponse.json({
      ok: true,
      sent: result.sent,
      provider: result.provider,
      messageId: result.messageId,
      message:
        "Se o email existir, voce recebera a mensagem de recuperacao em instantes.",
    });
  } catch (error) {
    console.error("Erro ao processar recuperacao de senha", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Nao foi possivel processar a recuperacao agora. Tente novamente.",
      },
      { status: 500 }
    );
  }
}