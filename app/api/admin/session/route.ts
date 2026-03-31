import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionSignature,
  isAdminProtectionEnabled,
  isValidAdminToken,
} from "@/lib/admin-session";
import { observeAuth } from "@/lib/sports-feed-monitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminProtectionEnabled()) {
    return NextResponse.json({ error: "Admin protection is not enabled." }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as { token?: string };
  if (!isValidAdminToken(body.token)) {
    observeAuth("login-failed", {
      ip: request.headers.get("x-forwarded-for") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });
    return NextResponse.json({ error: "Invalid admin token." }, { status: 401 });
  }

  observeAuth("login-success", {
    ip: request.headers.get("x-forwarded-for") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionSignature(),
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  observeAuth("logout");
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
