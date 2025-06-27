import { baseBackendFetch } from "../base-backend-fetch";

export const getAppSessionRequests = async (
  appSessionId: string,
  numRows: number = 10
) => {
  const response = await baseBackendFetch(`dashboard/push-new-requests`, {
    method: "POST",
    body: JSON.stringify({
      session_id: appSessionId,
      num_rows: numRows,
    }),
  });
  return response;
};
