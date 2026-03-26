import { NextResponse } from "next/server";

const demoLaunchByGameSymbol: Record<string, string> = {
  vs20fruitsw:
    "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pt&cur=BRL&gameSymbol=vs20fruitsw&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99",
  vs20olympgate:
    "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pt&cur=BRL&gameSymbol=vs20olympgate&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99",
};

type LaunchBody = {
  gameSymbol?: string;
  playerId?: string;
  balance?: number;
  currency?: string;
  locale?: string;
};

function getDemoUrl(gameSymbol: string) {
  return (
    demoLaunchByGameSymbol[gameSymbol] ??
    `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pt&cur=BRL&gameSymbol=${encodeURIComponent(
      gameSymbol
    )}&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99`
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LaunchBody;
    const gameSymbol = body.gameSymbol?.trim();

    if (!gameSymbol) {
      return NextResponse.json(
        { ok: false, message: "gameSymbol é obrigatório." },
        { status: 400 }
      );
    }

    const launchApiUrl = process.env.PROVIDER_LAUNCH_API_URL;
    const launchApiKey = process.env.PROVIDER_LAUNCH_API_KEY;

    if (!launchApiUrl || !launchApiKey) {
      return NextResponse.json({
        ok: true,
        mode: "demo",
        integrated: false,
        launchUrl: getDemoUrl(gameSymbol),
      });
    }

    const response = await fetch(launchApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${launchApiKey}`,
      },
      body: JSON.stringify({
        provider: "pragmatic",
        gameSymbol,
        playerId: body.playerId ?? "guest",
        balance: Math.round(Number(body.balance ?? 0) * 100),
        currency: body.currency ?? "BRL",
        locale: body.locale ?? "pt-BR",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({
        ok: true,
        mode: "demo",
        integrated: false,
        launchUrl: getDemoUrl(gameSymbol),
      });
    }

    const payload = (await response.json()) as {
      launchUrl?: string;
      url?: string;
      data?: { launchUrl?: string; url?: string };
    };

    const launchUrl =
      payload.launchUrl ?? payload.url ?? payload.data?.launchUrl ?? payload.data?.url;

    if (!launchUrl) {
      return NextResponse.json({
        ok: true,
        mode: "demo",
        integrated: false,
        launchUrl: getDemoUrl(gameSymbol),
      });
    }

    return NextResponse.json({
      ok: true,
      mode: "integrated",
      integrated: true,
      launchUrl,
    });
  } catch {
    return NextResponse.json(
      {
        ok: true,
        mode: "demo",
        integrated: false,
        launchUrl:
          "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=pt&cur=BRL&gameSymbol=vs20fruitsw&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99",
      },
      { status: 200 }
    );
  }
}
