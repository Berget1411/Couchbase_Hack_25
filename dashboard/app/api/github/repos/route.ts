import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GitHubService } from "@/lib/api/github-service";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Get user's GitHub repositories
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user's GitHub access token from the account
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

    const githubService = new GitHubService(account.accessToken);
    const repos = await githubService.getUserRepositories();

    // Filter only public repositories
    const publicRepos = repos.filter((repo) => !repo.private);

    return NextResponse.json(publicRepos);
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}

// Create or connect a GitHub repository
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, url } = await request.json();

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    // Check if repo already exists
    let githubRepo = await prisma.appGithubRepo.findFirst({
      where: { url },
    });

    // Create new repo if it doesn't exist
    if (!githubRepo) {
      githubRepo = await prisma.appGithubRepo.create({
        data: {
          name,
          url,
        },
      });
    }

    return NextResponse.json(githubRepo);
  } catch (error) {
    console.error("Error creating/connecting GitHub repository:", error);
    return NextResponse.json(
      { error: "Failed to create/connect repository" },
      { status: 500 }
    );
  }
}
