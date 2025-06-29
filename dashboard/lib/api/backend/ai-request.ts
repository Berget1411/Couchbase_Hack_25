import { baseBackendFetch } from "../base-backend-fetch";
import { RequestData, UserQuery } from "@/types/request";

export const sendAiRequest = async (request: {
  repo_url: string;
  user_query: UserQuery;
  input_requests: RequestData[];
}) => {
  const response = await baseBackendFetch("dashboard/send-requests", {
    method: "POST",
    body: JSON.stringify({
      repo_url: request.repo_url,
      user_query: request.user_query,
      input_requests: request.input_requests,
    }),
  });
  return response;
};
