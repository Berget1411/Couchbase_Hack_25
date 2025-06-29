import { baseBackendFetch } from "../base-backend-fetch";
import { RequestData, UserQuery } from "@/types/request";

export const sendAiRequest = async (request: {
  repo_url: string;
  user_query: UserQuery;
  input_requests: RequestData[];
}) => {
  // Convert RequestData objects to relevant string array for backend analysis
  const stringRequests = request.input_requests.map((req) => {
    // Create a string representation with only analysis-relevant fields
    return `REQUEST_BODY: ${req.requestData}, METHOD: ${req.method}, SENDER_IP: ${req.senderIp}, FLAG: ${req.flag}, ID: ${req.id}`;
  });

  const response = await baseBackendFetch("dashboard/send-requests", {
    method: "POST",
    body: JSON.stringify({
      repo_url: request.repo_url,
      user_query: request.user_query,
      input_requests: stringRequests,
    }),
  });
  return response;
};
