import { NextRequest, NextResponse } from "next/server";
import {
  getAppSession,
  updateAppSession,
  deleteAppSession,
} from "@/lib/api/dashboard/app-session-fetch";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { appSessionId: string } }
) {
  const { appSessionId } = params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appSession = await getAppSession(appSessionId);
  return NextResponse.json(appSession);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { appSessionId: string } }
) {
  const { appSessionId } = params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appSession = await updateAppSession(appSessionId);
  return NextResponse.json(appSession);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { appSessionId: string } }
) {
  const { appSessionId } = params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appSession = await deleteAppSession(appSessionId);

  return NextResponse.json(appSession);
}
