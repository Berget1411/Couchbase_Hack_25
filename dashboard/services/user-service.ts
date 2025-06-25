import { prisma } from "@/lib/prisma";

export const getUserByApiKey = async (apiKey: string) => {
  return prisma.user.findFirst({
    where: { apiKey: apiKey },
  });
};
