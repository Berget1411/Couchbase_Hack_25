interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export class GitHubService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getUserRepositories(): Promise<GitHubRepo[]> {
    const response = await fetch(
      "https://api.github.com/user/repos?type=all&sort=updated&per_page=100",
      {
        headers: {
          Authorization: `token ${this.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `token ${this.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async checkTokenValidity(): Promise<boolean> {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${this.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export type { GitHubRepo };

export const getStars = async () => {
  const response = await fetch(
    "https://api.github.com/repos/Berget1411/Couchbase_Hack_25"
  );
  const data = await response.json();
  return data.stargazers_count;
};
