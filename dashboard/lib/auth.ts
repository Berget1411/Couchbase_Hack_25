import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { sendMailWithOTP } from "@/lib/send-mail";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: process.env.POLAR_ENVIRONMENT as "sandbox" | "production",
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["user:email", "repo"],
    },
  },
  user: {
    additionalFields: {
      apiKey: {
        type: "string",
        required: true,
        defaultValue: () => {
          // Generate a random API key using crypto
          return crypto.randomUUID();
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(email, otp, type);
        console.log("Sending verification OTP to", email, otp, type);
        await sendMailWithOTP(email, otp);
      },
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "123-456-789", // ID of Product from Polar Dashboard
              slug: "pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
            },
            // Credit packages for AI analysis
            {
              productId: process.env.POLAR_CREDITS_10_PRODUCT_ID!, // 10 credits for $3
              slug: "credits-10",
            },
            {
              productId: process.env.POLAR_CREDITS_50_PRODUCT_ID!, // 50 credits for $15
              slug: "credits-50",
            },
            {
              productId: process.env.POLAR_CREDITS_100_PRODUCT_ID!, // 100 credits for $30
              slug: "credits-100",
            },
          ],
          successUrl:
            "/dashboard?purchase_success=true&checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onCustomerStateChanged: async (payload) => {
            // Triggered when anything regarding a customer changes
            console.log("Customer state changed:", payload);
          },
          onOrderPaid: async (payload) => {
            // Triggered when an order was paid (purchase, subscription renewal, etc.)
            console.log("Order paid:", payload);

            // Handle credit purchases
            try {
              const { CreditService } = await import(
                "@/services/credit-service"
              );

              // Map product IDs to credit amounts
              const creditMap: Record<string, number> = {
                [process.env.POLAR_CREDITS_10_PRODUCT_ID!]: 10,
                [process.env.POLAR_CREDITS_50_PRODUCT_ID!]: 50,
                [process.env.POLAR_CREDITS_100_PRODUCT_ID!]: 100,
              };

              // Check if this is a credit purchase
              for (const productId of Object.keys(creditMap)) {
                if (payload.data.productId === productId) {
                  const credits = creditMap[productId];
                  let userId = null;

                  // Method 1: Try to get userId from customer.externalId (if properly linked)
                  if (payload.data.customer?.externalId) {
                    userId = payload.data.customer.externalId;
                    console.log(`Found user ID from externalId: ${userId}`);
                  }

                  // Method 2: If no externalId, get the checkout and find the user from the checkout metadata
                  if (!userId && payload.data.checkoutId) {
                    try {
                      console.log(
                        `Getting checkout details for: ${payload.data.checkoutId}`
                      );
                      const checkout = await polarClient.checkouts.get({
                        id: payload.data.checkoutId,
                      });

                      // The checkout should have customerExternalId if user was authenticated during checkout
                      if (checkout.customerExternalId) {
                        userId = checkout.customerExternalId;
                        console.log(`Found user ID from checkout: ${userId}`);
                      }
                    } catch (checkoutError) {
                      console.error(
                        "Failed to get checkout details:",
                        checkoutError
                      );
                    }
                  }

                  // Method 3: If still no userId, find user by email as fallback
                  if (!userId && payload.data.customer?.email) {
                    console.log(
                      `Finding user by email: ${payload.data.customer.email}`
                    );

                    // Import prisma to find user by email
                    const { prisma } = await import("@/lib/prisma");
                    const user = await prisma.user.findUnique({
                      where: { email: payload.data.customer.email },
                      select: { id: true },
                    });

                    if (user) {
                      userId = user.id;
                      console.log(`Found user by email: ${userId}`);
                    } else {
                      console.error(
                        `No user found with email: ${payload.data.customer.email}`
                      );
                    }
                  }

                  // Add credits if we found a user
                  if (userId) {
                    await CreditService.addCredits(userId, credits);
                    console.log(`Added ${credits} credits to user ${userId}`);
                  } else {
                    console.error(
                      "Could not determine user ID for credit addition"
                    );
                    console.error("Available data:", {
                      customerExternalId: payload.data.customer?.externalId,
                      customerEmail: payload.data.customer?.email,
                      checkoutId: payload.data.checkoutId,
                    });
                  }
                  break;
                }
              }
            } catch (error) {
              console.error("Error processing credit purchase:", error);
            }
          },
          onPayload: async (payload) => {
            // Catch-all for all events
            console.log("Webhook payload:", payload);
          },
        }),
      ],
    }),
  ],
});
