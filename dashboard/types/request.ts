import { z } from "zod";

export const requestSchema = z.object({
  id: z.number(),
  timestamp: z.string(),
  method: z.string(),
  senderIp: z.string(),
  sessionId: z.string(),
  apiKey: z.string(),
  flag: z.number().min(0).max(2), // 0=good, 1=flagged request body, 2=blocked origin
  requestData: z.string(),
  docId: z.string(),
});

export type RequestData = z.infer<typeof requestSchema>;

// Predefined user query types
export const PREDEFINED_QUERIES = {
  CODE_SNIPPET: "Which code snippet is this request involved in",
  EXPLAIN_REQUESTS: "Explain these requests",
  ERROR_DEBUGGING:
    "This request returns an error, which code is malfunctioning?",
} as const;

// User query can be one of the predefined queries or any custom string
export type UserQuery =
  | (typeof PREDEFINED_QUERIES)[keyof typeof PREDEFINED_QUERIES]
  | string;

// Helper function to get all predefined query options
export const getPredefinedQueries = () => Object.values(PREDEFINED_QUERIES);

// Type guard to check if a query is predefined
export const isPredefinedQuery = (
  query: string
): query is (typeof PREDEFINED_QUERIES)[keyof typeof PREDEFINED_QUERIES] => {
  return Object.values(PREDEFINED_QUERIES).includes(
    query as (typeof PREDEFINED_QUERIES)[keyof typeof PREDEFINED_QUERIES]
  );
};
