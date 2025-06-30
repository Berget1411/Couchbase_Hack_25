import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://51.12.61.210:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, "DELETE");
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, "OPTIONS");
}

async function forwardRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  try {
    const targetPath = path.join("/");
    const targetUrl = `${BACKEND_URL}/${targetPath}`;

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    // Prepare headers (excluding hop-by-hop headers)
    const forwardHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      // Skip headers that shouldn't be forwarded
      if (
        !["host", "connection", "upgrade", "proxy-authorization"].includes(
          key.toLowerCase()
        )
      ) {
        forwardHeaders[key] = value;
      }
    });

    // Get request body if present
    let body: string | undefined;
    if (request.body && method !== "GET" && method !== "HEAD") {
      body = await request.text();
    }

    // Forward the request to the backend
    const response = await fetch(fullUrl, {
      method,
      headers: forwardHeaders,
      body,
    });

    // Prepare response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Skip headers that might cause issues
      if (
        !["transfer-encoding", "connection", "upgrade"].includes(
          key.toLowerCase()
        )
      ) {
        responseHeaders.set(key, value);
      }
    });

    // Add CORS headers for browser requests
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    responseHeaders.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );

    // Get response body
    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Proxy request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
