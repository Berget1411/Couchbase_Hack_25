import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAppSession,
  createAppSession,
  updateAppSession,
  deleteAppSession,
  getAppSessionByUserId,
} from "@/lib/api/dashboard/app-session-fetch";

export const useGetAppSession = (appSessionId: string) => {
  return useQuery({
    queryKey: ["appSession", appSessionId],
    queryFn: () => getAppSession(appSessionId),
    enabled: !!appSessionId,
  });
};

export const useGetAppSessionsByUserId = () => {
  return useQuery({
    queryKey: ["appSessions"],
    queryFn: () => getAppSessionByUserId(),
  });
};

export const useCreateAppSession = () => {
  return useMutation({
    mutationFn: (appSessionName?: string) => createAppSession(appSessionName),
  });
};

export const useUpdateAppSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appSessionId,
      githubRepoId,
    }: {
      appSessionId: string;
      githubRepoId?: string;
    }) => updateAppSession(appSessionId, githubRepoId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appSession", variables.appSessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["appSessions"] });
    },
  });
};

export const useDeleteAppSession = () => {
  return useMutation({
    mutationFn: (appSessionId: string) => deleteAppSession(appSessionId),
  });
};
