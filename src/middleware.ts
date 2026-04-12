import { NextRequest, NextResponse } from "next/server";

/**
 * Password-gate the admin panel and admin API via HTTP Basic Auth.
 * Username is fixed ("admin"). Password comes from ADMIN_PASSWORD env var.
 *
 * Browser natively prompts for credentials on first request and caches
 * them for the session — no custom login UI needed.
 */
export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  // If ADMIN_PASSWORD isn't set, fail closed with a clear message.
  if (!password) {
    return new NextResponse("Admin lock misconfigured: ADMIN_PASSWORD not set.", {
      status: 503,
    });
  }

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const encoded = header.slice(6).trim();
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const idx = decoded.indexOf(":");
    const user = idx === -1 ? decoded : decoded.slice(0, idx);
    const pass = idx === -1 ? "" : decoded.slice(idx + 1);
    if (user === "admin" && pass === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Carroll for Judge — Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
