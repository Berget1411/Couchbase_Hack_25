import { createAuthClient } from "better-auth/react";

import { polarClient } from "@polar-sh/better-auth";
import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"),
  plugins: [
    polarClient(),
    emailOTPClient(),
    inferAdditionalFields({
      user: {
        apiKey: {
          type: "string",
          required: true,
          defaultValue: () => {
            return crypto.randomUUID();
          },
        },
      },
    }),
  ],
});
