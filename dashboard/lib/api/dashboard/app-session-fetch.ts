import { baseDashboardFetch } from "../base-dashboard-fetch";
import { AppSession } from "@prisma/client";

export const getAppSession = async (appId: string) => {
  return baseDashboardFetch<AppSession>(`app-session/${appId}`);
};

export const getAppSessionByUserId = async (userId: string) => {
  return baseDashboardFetch<AppSession>(`app-session/user/${userId}`);
};

export const createAppSession = async (appId: string) => {
  return baseDashboardFetch<AppSession>(`app-session`, {
    method: "POST",
    body: JSON.stringify({ appId }),
  });
};

export const updateAppSession = async (appId: string) => {
  return baseDashboardFetch<AppSession>(`app-session/${appId}`, {
    method: "PUT",
    body: JSON.stringify({ appId }),
  });
};

export const deleteAppSession = async (appId: string) => {
  return baseDashboardFetch<AppSession>(`app-session/${appId}`, {
    method: "DELETE",
  });
};
