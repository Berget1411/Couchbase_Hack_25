import { useMutation } from "@tanstack/react-query";
import { sendAiRequest } from "@/lib/api/backend/ai-request";

export const useSendAiRequest = () => {
  return useMutation({
    mutationFn: sendAiRequest,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
