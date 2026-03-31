import { NextResponse, type NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "bc_admin_session";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function signInEdge(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(signature);
}

function isAdminProtectionEnabled() {
  return Boolean(process.env.SPORTS_AUDIT_ADMIN_TOKEN && (process.env.SPORTS_ADMIN_COOKIE_SECRET || process.env.SPORTS_FEED_HMAC_SECRET));
}

export async function proxy(request: NextRequest) {
  if (!isAdminProtectionEnabled()) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith("/operacao") || pathname.startsWith("/operacao/acesso")) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const token = process.env.SPORTS_AUDIT_ADMIN_TOKEN || "";
  const secret = process.env.SPORTS_ADMIN_COOKIE_SECRET || process.env.SPORTS_FEED_HMAC_SECRET || "";
  const expected = await signInEdge(`${token}:v1`, secret);

  if (cookie && cookie === expected) {
    const response = NextResponse.next();
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: cookie,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  }

  const loginUrl = new URL("/operacao/acesso", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/operacao/:path*"],
};
