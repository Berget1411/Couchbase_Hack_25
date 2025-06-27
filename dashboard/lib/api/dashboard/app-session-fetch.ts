import { baseDashboardFetch } from "../base-dashboard-fetch";
import { AppSession } from "@prisma/client";

export interface AppSessionWithRepo extends AppSession {
  githubRepo?: {
    id: string;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export const getAppSession = async (appSessionId: string) => {
  return baseDashboardFetch<AppSessionWithRepo>(`app-session/${appSessionId}`);
};

export const getAppSessionByUserId = async () => {
  return baseDashboardFetch<AppSession[]>(`app-session`);
};

export const createAppSession = async (appSessionName?: string) => {
  return baseDashboardFetch<AppSession>(`app-session`, {
    method: "POST",
    body: JSON.stringify({ appSessionName }),
  });
};

export const updateAppSession = async (
  appSessionId: string,
  githubRepoId?: string
) => {
  return baseDashboardFetch<AppSessionWithRepo>(`app-session/${appSessionId}`, {
    method: "PUT",
    body: JSON.stringify({ githubRepoId }),
  });
};

export const deleteAppSession = async (appSessionId: string) => {
  return baseDashboardFetch<AppSession>(`app-session/${appSessionId}`, {
    method: "DELETE",
  });
};
