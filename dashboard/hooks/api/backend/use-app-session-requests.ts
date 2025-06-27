import { useQuery } from "@tanstack/react-query";
import { getAppSessionRequests } from "@/lib/api/backend/app-session-requests";

export const useAppSessionRequests = (
  appSessionId: string,
  numRows: number = 10
) => {
  return useQuery({
    queryKey: ["app-session-requests", appSessionId, numRows],
    queryFn: () => getAppSessionRequests(appSessionId, numRows),
    enabled: !!appSessionId,
  });
};
