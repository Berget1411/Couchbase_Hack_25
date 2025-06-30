export const baseBackendFetch = async <T>(
  query: string,
  options?: RequestInit
): Promise<T> => {
  // In production (Vercel), use the proxy to avoid mixed content issues
  // In development, directly connect to backend
  const isProduction =
    typeof window !== "undefined" && window.location.protocol === "https:";

  const backendUrl = isProduction
    ? `/api/backend-proxy` // Use proxy in production
    : process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.BACKEND_URL ||
      "http://localhost:8000";

  if (
    !isProduction &&
    !process.env.NEXT_PUBLIC_BACKEND_URL &&
    !process.env.BACKEND_URL
  ) {
    console.warn(
      "Backend URL is not configured or using fallback. Please set NEXT_PUBLIC_BACKEND_URL or BACKEND_URL environment variable."
    );
  }

  // Don't set Content-Type header for FormData requests
  // The browser will automatically set the correct Content-Type with boundary for FormData
  const headers =
    options?.body instanceof FormData
      ? { ...options?.headers }
      : {
          "Content-Type": "application/json",
          ...options?.headers,
        };

  const response = await fetch(`${backendUrl}/${query}`, {
    ...options,
    headers,
    credentials: "include",
  });

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
