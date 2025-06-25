import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoFullName } = await request.json();

    if (!repoFullName || typeof repoFullName !== "string") {
      return NextResponse.json(
        { error: "Repository name is required" },
        { status: 400 }
      );
    }

    // Check if repository is connected
    const existingRepo = await prisma.appGithubRepo.findFirst({
      where: {
        userId: session.user.id,
        fullName: repoFullName,
      },
    });

    if (!existingRepo) {
      return NextResponse.json(
        { error: "Repository not connected" },
        { status: 404 }
      );
    }

    // Remove repository from database
    await prisma.appGithubRepo.deleteMany({
      where: {
        userId: session.user.id,
        fullName: repoFullName,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Repository ${repoFullName} disconnected successfully`,
    });
  } catch (error) {
    console.error("Error disconnecting repository:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
