import { useMutation } from "@tanstack/react-query";
import { chatFetch } from "@/lib/api/chat-fetch";

export const useChat = () => {
  return useMutation({
    mutationFn: async (message: string) => {
      const response = await chatFetch(message);
      return response;
    },
  });
};
