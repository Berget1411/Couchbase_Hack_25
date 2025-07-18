import { prisma } from "@/lib/prisma";

export const checkUserExists = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  return user !== null;
};

export const validateApiKey = async (apiKey: string) => {
  const user = await prisma.user.findFirst({
    where: {
      apiKey,
    },
  });

  if (!user) {
    return false;
  }

  return true;
};
