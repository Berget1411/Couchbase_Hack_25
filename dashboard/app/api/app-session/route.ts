import { NextRequest, NextResponse } from "next/server";
import { getAppSessionByUserId } from "@/lib/api/dashboard/app-session-fetch";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appSession = await getAppSessionByUserId(session.user.id);
  return NextResponse.json(appSession);
}
