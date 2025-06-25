import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/api/github-service";

export async function POST(request: NextRequest) {
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

    // Check if repository is already connected
    const existingRepo = await prisma.appGithubRepo.findFirst({
      where: {
        userId: session.user.id,
        fullName: repoFullName,
      },
    });

    if (existingRepo) {
      return NextResponse.json(
        { error: "Repository already connected" },
        { status: 400 }
      );
    }

    // Get user's GitHub account with access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "github",
      },
    });

    if (!account?.accessToken) {
      return NextResponse.json(
        { error: "GitHub account not connected" },
        { status: 400 }
      );
    }

    // Fetch repository details from GitHub API
    const [owner, repo] = repoFullName.split("/");
    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Invalid repository format" },
        { status: 400 }
      );
    }

    const githubService = new GitHubService(account.accessToken);
    const repoData = await githubService.getRepository(owner, repo);

    // Save repository to database
    const connectedRepo = await prisma.appGithubRepo.create({
      data: {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues: repoData.open_issues_count,
        userId: session.user.id,
      },
    });

    return NextResponse.json(connectedRepo);
  } catch (error) {
    console.error("Error connecting repository:", error);

    if (error instanceof Error && error.message.includes("GitHub API error")) {
      return NextResponse.json(
        { error: "Repository not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
