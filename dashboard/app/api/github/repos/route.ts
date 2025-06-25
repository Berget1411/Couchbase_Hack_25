import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/api/github-service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Check if token is still valid
    const githubService = new GitHubService(account.accessToken);
    const isTokenValid = await githubService.checkTokenValidity();

    if (!isTokenValid) {
      return NextResponse.json(
        { error: "GitHub token expired" },
        { status: 401 }
      );
    }

    // Fetch repositories from GitHub API
    const githubRepos = await githubService.getUserRepositories();

    // Get user's connected repositories from database
    const connectedRepos = await prisma.appGithubRepo.findMany({
      where: { userId: session.user.id },
    });

    const connectedRepoNames = new Set(
      connectedRepos.map((repo) => repo.fullName)
    );

    // Combine GitHub data with connection status
    const reposWithStatus = githubRepos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      private: repo.private,
      owner: repo.owner,
      isConnected: connectedRepoNames.has(repo.full_name),
    }));

    return NextResponse.json(reposWithStatus);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
