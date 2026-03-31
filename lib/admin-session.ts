import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "bc_admin_session";

function getAdminToken() {
  return process.env.SPORTS_AUDIT_ADMIN_TOKEN || "";
}

function getCookieSecret() {
  return process.env.SPORTS_ADMIN_COOKIE_SECRET || process.env.SPORTS_FEED_HMAC_SECRET || "";
}

export function isAdminProtectionEnabled() {
  return Boolean(getAdminToken() && getCookieSecret());
}

function sessionPayload() {
  return `${getAdminToken()}:v1`;
}

export function createAdminSessionSignature() {
  const secret = getCookieSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(sessionPayload()).digest("hex");
}

export function isValidAdminSessionCookie(cookieValue: string | undefined) {
  if (!cookieValue) return false;

  const expected = createAdminSessionSignature();
  if (!expected || cookieValue.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isValidAdminToken(token: string | undefined) {
  if (!token) return false;
  const expected = getAdminToken();
  if (!expected || expected.length !== token.length) return false;

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
