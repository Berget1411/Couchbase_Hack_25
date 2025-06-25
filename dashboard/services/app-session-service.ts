import { prisma } from "@/lib/prisma";

export const getAppSession = async (userId: string) => {
  return prisma.appSession.findFirst({
    where: { userId: userId },
    include: {
      githubRepo: true,
    },
  });
};

export const createAppSession = async (userId: string) => {
  return prisma.appSession.create({
    data: {
      userId: userId,
    },
  });
};

export const updateAppSession = async (appId: string) => {
  return prisma.appSession.update({
    where: { id: appId },
    data: {
      githubRepoId: appId,
    },
  });
};

export const deleteAppSession = async (appId: string) => {
  return prisma.appSession.delete({
    where: { id: appId },
  });
};
