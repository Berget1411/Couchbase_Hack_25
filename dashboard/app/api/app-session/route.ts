import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createAppSession,
  getAppSessionsByUserId,
} from "@/services/app-session-service";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appSessions = await getAppSessionsByUserId(session.user.id);
  return NextResponse.json(appSessions);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { appSessionName } = body;
  const appSession = await createAppSession(session.user.id, appSessionName);
  return NextResponse.json(appSession);
}
