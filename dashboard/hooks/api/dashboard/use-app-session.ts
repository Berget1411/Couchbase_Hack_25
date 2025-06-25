import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAppSession,
  createAppSession,
  updateAppSession,
  deleteAppSession,
} from "@/lib/api/dashboard/app-session-fetch";

export const useGetAppSession = (appId: string) => {
  return useQuery({
    queryKey: ["appSession", appId],
    queryFn: () => getAppSession(appId),
  });
};

export const useCreateAppSession = () => {
  return useMutation({
    mutationFn: createAppSession,
  });
};

export const useUpdateAppSession = (appId: string) => {
  return useMutation({
    mutationFn: () => updateAppSession(appId),
  });
};

export const useDeleteAppSession = (appId: string) => {
  return useMutation({
    mutationFn: () => deleteAppSession(appId),
  });
};
