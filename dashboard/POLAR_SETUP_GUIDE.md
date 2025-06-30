# Fix Polar.sh 400 Error - Setup Guide

The 400 error you're experiencing is because the required Polar.sh environment variables are not configured. Here's how to fix it:

## Step 1: Create .env.local File

Create a file named `.env.local` in your dashboard directory with the following content:

```bash
# Better Auth (you might already have these)
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Database
DATABASE_URL="your_database_url_here"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# ==============================
# POLAR.SH CONFIGURATION
# ==============================

# 1. Get your access token from Polar Dashboard
POLAR_ACCESS_TOKEN="your_polar_access_token_here"

# 2. Webhook secret (set up in step 4)
POLAR_WEBHOOK_SECRET="your_polar_webhook_secret_here"

# 3. Product IDs (create products in step 3)
POLAR_CREDITS_10_PRODUCT_ID="your_10_credits_product_id"
POLAR_CREDITS_50_PRODUCT_ID="your_50_credits_product_id"
POLAR_CREDITS_100_PRODUCT_ID="your_100_credits_product_id"
```

## Step 2: Create Polar.sh Organization

1. Go to [polar.sh](https://polar.sh)
2. Sign up/login and create an organization
3. Go to Organization Settings → API
4. Create a new access token and copy it to `POLAR_ACCESS_TOKEN`

## Step 3: Create Credit Products

Create three products in your Polar dashboard:

### Product 1: Starter Pack

- **Name**: AI Analysis Credits - Starter Pack
- **Price**: $3.00 USD
- **Type**: One-time purchase
- **Description**: 10 AI analysis credits

### Product 2: Value Pack

- **Name**: AI Analysis Credits - Value Pack
- **Price**: $15.00 USD
- **Type**: One-time purchase
- **Description**: 50 AI analysis credits

### Product 3: Power Pack

- **Name**: AI Analysis Credits - Power Pack
- **Price**: $30.00 USD
- **Type**: One-time purchase
- **Description**: 100 AI analysis credits

**After creating each product, copy its ID to the corresponding environment variable.**

## Step 4: Set Up Webhook

1. In your Polar dashboard, go to Organization Settings → Webhooks
2. Add new webhook endpoint: `https://yourdomain.com/api/auth/polar/webhooks`
   - For local development: `http://localhost:3000/api/auth/polar/webhooks`
3. Select these events:
   - `order.paid`
   - `customer.created`
   - `customer.updated`
4. Copy the webhook secret to `POLAR_WEBHOOK_SECRET`

## Step 5: Test Configuration

1. Restart your development server: `npm run dev`
2. Try purchasing credits from the dashboard
3. Check your browser console for any errors
4. Verify webhook delivery in Polar dashboard

## Quick Fix for Development

If you want to test without setting up Polar immediately, you can comment out the credit purchase functionality temporarily:

1. In `dashboard/components/credits/credit-purchase.tsx`, add this at the top of the `handlePurchase` function:

```typescript
const handlePurchase = async (
  packageSlug: (typeof creditPackages)[0]["slug"]
) => {
  toast.error("Polar.sh not configured. Please see POLAR_SETUP_GUIDE.md");
  return;
  // ... rest of function
};
```

## Troubleshooting

### Common Issues:

1. **400 Error**: Environment variables not set or incorrect
2. **404 Error**: Product IDs don't exist in Polar
3. **Webhook not working**: Wrong URL or secret

### Debug Steps:

1. Check if `.env.local` exists and has all variables
2. Restart your development server after adding environment variables
3. Verify product IDs in Polar dashboard match your environment variables
4. Test webhook endpoint manually

### Environment Variables Check:

Add this to any component to debug:

```typescript
console.log("Polar Config:", {
  hasAccessToken: !!process.env.POLAR_ACCESS_TOKEN,
  hasWebhookSecret: !!process.env.POLAR_WEBHOOK_SECRET,
  hasProduct10: !!process.env.POLAR_CREDITS_10_PRODUCT_ID,
  hasProduct50: !!process.env.POLAR_CREDITS_50_PRODUCT_ID,
  hasProduct100: !!process.env.POLAR_CREDITS_100_PRODUCT_ID,
});
```

## Support

If you're still having issues:

1. Check the Polar.sh documentation
2. Verify your organization is in sandbox mode for testing
3. Ensure webhook URL is publicly accessible (use ngrok for local testing)
