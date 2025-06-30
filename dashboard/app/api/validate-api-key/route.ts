import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/service";
import { createAppSession } from "@/services/app-session-service";
import { getUserByApiKey } from "@/services/user-service";

// CORS headers for cross-origin requests
const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
const corsHeaders = {
  "Access-Control-Allow-Origin": backendUrl,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400", // 24 hours
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey, appSessionName } = await request.json();

    const keyIsValid = await validateApiKey(apiKey);

    if (keyIsValid) {
      const user = await getUserByApiKey(apiKey);
      if (!user) {
        return NextResponse.json(
          { appSessionId: "0" },
          { headers: corsHeaders }
        );
      }

      const appSession = await createAppSession(
        user.id,
        appSessionName || "New App Session"
      );
      return NextResponse.json(
        { appSessionId: appSession.id },
        { headers: corsHeaders }
      );
    } else {
      return NextResponse.json({ appSessionId: "0" }, { headers: corsHeaders });
    }
  } catch (error) {
    console.error("Error in validate-api-key:", error);
    return NextResponse.json(
      { error: "Internal server error", appSessionId: "0" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Also support GET method for simple API key validation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required", valid: false },
        { status: 400, headers: corsHeaders }
      );
    }

    const keyIsValid = await validateApiKey(apiKey);

    return NextResponse.json({ valid: keyIsValid }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error in validate-api-key GET:", error);
    return NextResponse.json(
      { error: "Internal server error", valid: false },
      { status: 500, headers: corsHeaders }
    );
  }
}
