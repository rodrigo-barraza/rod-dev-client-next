import { NextRequest, NextResponse } from "next/server";
import { SESSIONS_SERVICE_URL } from "@/config";

/**
 * Catch-all API proxy route for sessions-service.
 *
 * All requests to /api/sessions/* are forwarded to the sessions-service
 * backend. This keeps the sessions-service internal (no public domain)
 * while allowing the client to reach it through the Next.js server.
 *
 * The proxy also forwards the client's IP address via x-forwarded-for
 * so the sessions-service can perform accurate IP geolocation.
 */

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const p = await params;
    const path = p.path;
    const segments = Array.isArray(path) ? path.join("/") : path || "";
    const queryString = request.nextUrl.search;
    const url = `${SESSIONS_SERVICE_URL}/${segments}${queryString}`;

    // Forward the client's real IP
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (clientIp) {
      headers["x-forwarded-for"] = clientIp;
      headers["x-real-ip"] = clientIp;
    }

    // Forward user-agent so sessions-service can parse browser/OS/device
    const userAgent = request.headers.get("user-agent");
    if (userAgent) {
      headers["user-agent"] = userAgent;
    }

    // Forward session ID header if present
    const sessionId = request.headers.get("x-session-id");
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    // Forward accept-language for locale detection
    const acceptLanguage = request.headers.get("accept-language");
    if (acceptLanguage) {
      headers["accept-language"] = acceptLanguage;
    }

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const bodyText = await request.text();
      if (bodyText) {
        fetchOptions.body = bodyText;
      }
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Proxy error";
    return NextResponse.json({ error: true, message }, { status: 502 });
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}
