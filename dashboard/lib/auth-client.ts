import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
  plugins: [
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
