import { NextResponse } from "next/server";
import { getFeedAudit } from "@/lib/sports-feed-monitor";
import {
  ADMIN_SESSION_COOKIE,
  isAdminProtectionEnabled,
  isValidAdminSessionCookie,
  isValidAdminToken,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

function toCsv(entries: ReturnType<typeof getFeedAudit>["entries"]) {
  const header = [
    "sequence",
    "timestamp",
    "health",
    "source",
    "mode",
    "provider",
    "latencyMs",
    "ticks",
    "incidents",
    "signature",
  ];

  const rows = entries.map((entry) => [
    String(entry.sequence),
    new Date(entry.timestamp).toISOString(),
    entry.health,
    entry.source,
    entry.mode,
    entry.provider,
    String(entry.latencyMs),
    String(entry.ticks),
    String(entry.incidents),
    entry.signature,
  ]);

  return [header, ...rows]
    .map((row) => row.map((field) => `"${field.replaceAll("\"", "\"\"")}"`).join(","))
    .join("\n");
}

function toAuthCsv(entries: ReturnType<typeof getFeedAudit>["authEntries"]) {
  const header = ["timestamp", "action", "ip", "userAgent"];
  const rows = entries.map((entry) => [
    new Date(entry.timestamp).toISOString(),
    entry.action,
    entry.ip || "",
    entry.userAgent || "",
  ]);

  return [header, ...rows]
    .map((row) => row.map((field) => `"${field.replaceAll("\"", "\"\"")}"`).join(","))
    .join("\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenFromQuery = url.searchParams.get("token") || "";
  const tokenFromHeader = request.headers.get("x-audit-token") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.split("=")[1];

  if (isAdminProtectionEnabled()) {
    const tokenOk = isValidAdminToken(tokenFromQuery) || isValidAdminToken(tokenFromHeader);
    const sessionOk = isValidAdminSessionCookie(sessionCookie);
    if (!tokenOk && !sessionOk) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const limitRaw = Number(url.searchParams.get("limit") || "120");
  const offsetRaw = Number(url.searchParams.get("offset") || "0");
  const cursorRaw = Number(url.searchParams.get("cursorTs") || "0");
  const authCursorRaw = Number(url.searchParams.get("authCursorTs") || "0");
  const format = (url.searchParams.get("format") || "json").toLowerCase();
  const usingCursor = Number.isFinite(cursorRaw) && cursorRaw > 0;
  const usingAuthCursor = Number.isFinite(authCursorRaw) && authCursorRaw > 0;

  const {
    entries,
    authEntries,
    metrics,
    totalEntries,
    totalAuthEntries,
    offset,
    limit,
    nextEntryCursorTs,
    nextAuthCursorTs,
  } = getFeedAudit(limitRaw, offsetRaw, usingCursor ? cursorRaw : undefined, usingAuthCursor ? authCursorRaw : undefined);

  if (format === "csv") {
    const csv = toCsv(entries);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=feed-audit-${Date.now()}.csv`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }

  if (format === "auth-csv") {
    const csv = toAuthCsv(authEntries);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=auth-audit-${Date.now()}.csv`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }

  return NextResponse.json(
    {
      entries,
      authEntries,
      metrics,
      pagination: {
        mode: usingCursor || usingAuthCursor ? "cursor" : "offset",
        offset,
        limit,
        cursorTs: usingCursor ? cursorRaw : null,
        authCursorTs: usingAuthCursor ? authCursorRaw : null,
        nextEntryCursorTs,
        nextAuthCursorTs,
        totalEntries,
        totalAuthEntries,
        hasMoreEntries: offset + limit < totalEntries,
        hasMoreAuthEntries: offset + limit < totalAuthEntries,
      },
      generatedAt: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
