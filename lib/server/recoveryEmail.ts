type RecoveryEmailResult = {
  sent: boolean;
  provider: "resend" | "mock";
  messageId?: string;
};

function getBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit;
  return "http://localhost:3000";
}

export async function enviarEmailRecuperacao(email: string): Promise<RecoveryEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RECOVERY_FROM_EMAIL ?? "BetClean <onboarding@resend.dev>";
  const appUrl = getBaseUrl();
  const recoveryLink = `${appUrl}/login?recovery=1&email=${encodeURIComponent(email)}`;

  const assunto = "Recuperacao de conta BetClean";
  const texto = [
    "Recebemos sua solicitacao de recuperacao de conta.",
    "",
    `Email da conta: ${email}`,
    `Link de recuperacao: ${recoveryLink}`,
    "",
    "Se voce nao solicitou, ignore esta mensagem.",
    "Equipe BetClean",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h2 style="margin:0 0 12px">Recuperacao de conta BetClean</h2>
      <p>Recebemos sua solicitacao de recuperacao de conta.</p>
      <p><strong>Email da conta:</strong> ${email}</p>
      <p>
        <a href="${recoveryLink}" style="display:inline-block;padding:10px 14px;background:#f59e0b;color:#111827;text-decoration:none;border-radius:8px;font-weight:700">
          Recuperar conta
        </a>
      </p>
      <p style="font-size:12px;color:#6b7280">Se voce nao solicitou, ignore esta mensagem.</p>
    </div>
  `;

  if (!apiKey) {
    console.warn("RESEND_API_KEY nao configurada. Email de recuperacao em modo mock.");
    console.info({ email, assunto, texto });
    return { sent: false, provider: "mock" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: assunto,
      text: texto,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao enviar email de recuperacao: ${errorText}`);
  }

  const data = (await response.json()) as { id?: string };

  return {
    sent: true,
    provider: "resend",
    messageId: data.id,
  };
}