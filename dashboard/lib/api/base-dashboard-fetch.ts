export const baseDashboardFetch = async <T>(
  query: string,
  options?: RequestInit
): Promise<T> => {
  // Don't set Content-Type header for FormData requests
  // The browser will automatically set the correct Content-Type with boundary for FormData
  const headers =
    options?.body instanceof FormData
      ? { ...options?.headers }
      : {
          "Content-Type": "application/json",
          ...options?.headers,
        };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/${query}`,
    {
      ...options,
      headers,
      credentials: "include",
    }
  );

  if (!response.ok) {
    try {
      const responseBody = await response.json();
      const error = new Error(
        responseBody.message || responseBody.error || "API request failed"
      ) as Error & {
        response: Response;
      };
      error.response = response;
      throw error;
    } catch {
      // If response isn't JSON, throw a generic error with the status
      const error = new Error(
        `API request failed with status ${response.status}`
      ) as Error & {
        response: Response;
      };
      error.response = response;
      throw error;
    }
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};
