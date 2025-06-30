import { NextRequest, NextResponse } from "next/server";
import {
  getAppSession,
  updateAppSession,
  deleteAppSession,
} from "@/services/app-session-service";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ "app-session-id": string }> }
) {
  const { "app-session-id": appSessionId } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appSession = await getAppSession(appSessionId);
  return NextResponse.json(appSession);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ "app-session-id": string }> }
) {
  const { "app-session-id": appSessionId } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { githubRepoId } = body;

    const appSession = await updateAppSession(appSessionId, githubRepoId);
    return NextResponse.json(appSession);
  } catch (error) {
    console.error("Error updating app session:", error);
    return NextResponse.json(
      { error: "Failed to update app session" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ "app-session-id": string }> }
) {
  const { "app-session-id": appSessionId } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appSession = await deleteAppSession(appSessionId);

  return NextResponse.json(appSession);
}
