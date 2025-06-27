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
