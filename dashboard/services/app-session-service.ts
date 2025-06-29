import { prisma } from "@/lib/prisma";

export const getAppSession = async (appSessionId: string) => {
  return prisma.appSession.findFirst({
    where: { id: appSessionId },
    include: {
      githubRepo: true,
    },
  });
};

export const getAppSessionsByUserId = async (userId: string) => {
  return prisma.appSession.findMany({
    where: { userId: userId },
    include: {
      githubRepo: true,
    },
  });
};

export const createAppSession = async (
  userId: string,
  appSessionName?: string
) => {
  return prisma.appSession.create({
    data: {
      userId: userId,
      name: appSessionName || "New App Session",
    },
  });
};

export const updateAppSession = async (
  appId: string,
  githubRepoId?: string
) => {
  return prisma.appSession.update({
    where: { id: appId },
    data: {
      githubRepoId: githubRepoId === undefined ? null : githubRepoId,
    },
    include: {
      githubRepo: true,
    },
  });
};

export const deleteAppSession = async (appId: string) => {
  return prisma.appSession.delete({
    where: { id: appId },
  });
};
