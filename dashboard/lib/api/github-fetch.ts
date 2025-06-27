import { baseDashboardFetch } from "./base-dashboard-fetch";
import { GitHubRepo } from "./github-service";

export interface AppGithubRepo {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export const getGitHubRepositories = async (): Promise<GitHubRepo[]> => {
  return baseDashboardFetch<GitHubRepo[]>("github/repos");
};

export const createGitHubRepo = async (
  name: string,
  url: string
): Promise<AppGithubRepo> => {
  return baseDashboardFetch<AppGithubRepo>("github/repos", {
    method: "POST",
    body: JSON.stringify({ name, url }),
  });
};
