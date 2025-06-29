import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGitHubRepositories,
  createGitHubRepo,
} from "@/lib/api/github-fetch";

export const useGitHubRepositories = () => {
  return useQuery({
    queryKey: ["github-repos"],
    queryFn: getGitHubRepositories,
    retry: false,
  });
};

// Alias for backward compatibility
export const useGitHubRepos = useGitHubRepositories;

export const useCreateGitHubRepo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, url }: { name: string; url: string }) =>
      createGitHubRepo(name, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
      queryClient.invalidateQueries({ queryKey: ["appSession"] });
    },
  });
};

// Alias for backward compatibility
export const useConnectRepo = useCreateGitHubRepo;

// For now, disconnecting a repo means creating it (since we don't have separate connect/disconnect)
export const useDisconnectRepo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ repoFullName }: { repoFullName: string }) => {
      // For now, this is a no-op since our data model doesn't support disconnecting repos
      // In a real implementation, this might remove the repo from the database
      console.log("Disconnect repo:", repoFullName);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
    },
  });
};
