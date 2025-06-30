import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["pbs.twimg.com"],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_DASHBOARD_API_URL: process.env.NEXT_PUBLIC_DASHBOARD_API_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,

    CB_USER: process.env.CB_USER,
    CB_PASSWORD: process.env.CB_PASSWORD,
    BUCKET_NAME: process.env.BUCKET_NAME,
    SCOPE_NAME: process.env.SCOPE_NAME,
    COLLECTION_NAME: process.env.COLLECTION_NAME,
    CB_CONNECT_STRING: process.env.CB_CONNECT_STRING,

    POLAR_ENVIRONMENT: process.env.POLAR_ENVIRONMENT,
    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
    POLAR_CREDITS_10_PRODUCT_ID: process.env.POLAR_CREDITS_10_PRODUCT_ID,
    POLAR_CREDITS_50_PRODUCT_ID: process.env.POLAR_CREDITS_50_PRODUCT_ID,
    POLAR_CREDITS_100_PRODUCT_ID: process.env.POLAR_CREDITS_100_PRODUCT_ID,
  },
};

export default nextConfig;
