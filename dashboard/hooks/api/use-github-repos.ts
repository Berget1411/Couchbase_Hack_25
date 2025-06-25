import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GitHubRepoWithStatus {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  isConnected: boolean;
}

interface ConnectRepoRequest {
  repoFullName: string;
}

interface DisconnectRepoRequest {
  repoFullName: string;
}

const GITHUB_REPOS_QUERY_KEY = ["github-repos"];

// Fetch GitHub repositories with connection status
export function useGitHubRepos() {
  return useQuery({
    queryKey: GITHUB_REPOS_QUERY_KEY,
    queryFn: async (): Promise<GitHubRepoWithStatus[]> => {
      const response = await fetch("/api/github/repos");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch repositories");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Connect a repository
export function useConnectRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repoFullName }: ConnectRepoRequest) => {
      const response = await fetch("/api/github/repos/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoFullName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to connect repository");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update the cache to mark repo as connected
      queryClient.setQueryData<GitHubRepoWithStatus[]>(
        GITHUB_REPOS_QUERY_KEY,
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((repo) =>
            repo.full_name === variables.repoFullName
              ? { ...repo, isConnected: true }
              : repo
          );
        }
      );

      toast.success(`Connected ${variables.repoFullName}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to connect repository");
    },
  });
}

// Disconnect a repository
export function useDisconnectRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repoFullName }: DisconnectRepoRequest) => {
      const response = await fetch("/api/github/repos/disconnect", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoFullName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to disconnect repository");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update the cache to mark repo as disconnected
      queryClient.setQueryData<GitHubRepoWithStatus[]>(
        GITHUB_REPOS_QUERY_KEY,
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((repo) =>
            repo.full_name === variables.repoFullName
              ? { ...repo, isConnected: false }
              : repo
          );
        }
      );

      toast.success(`Disconnected ${variables.repoFullName}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to disconnect repository");
    },
  });
}

// Get only connected repositories
export function useConnectedRepos() {
  const { data: allRepos, ...rest } = useGitHubRepos();

  const connectedRepos = allRepos?.filter((repo) => repo.isConnected) || [];

  return {
    data: connectedRepos,
    ...rest,
  };
}

export type { GitHubRepoWithStatus };
