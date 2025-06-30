# AI Analysis Credit System Setup

This document explains how to set up the credit-based payment system for AI analysis using Better Auth and Polar.sh.

## Overview

The system provides:

- 10 free AI analysis sessions per user
- Pay-per-use model: $0.30 per analysis after free credits are exhausted
- Credit packages for bulk purchases
- Integration with Polar.sh for secure payments

## Required Environment Variables

Add these to your `.env` file:

```env
# Polar.sh Configuration
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret

# Polar Credit Package Product IDs (create these in your Polar dashboard)
POLAR_CREDITS_10_PRODUCT_ID=your_10_credits_product_id   # 10 credits for $3.00
POLAR_CREDITS_50_PRODUCT_ID=your_50_credits_product_id   # 50 credits for $15.00
POLAR_CREDITS_100_PRODUCT_ID=your_100_credits_product_id # 100 credits for $30.00
```

## Polar.sh Setup Instructions

### 1. Create Products in Polar Dashboard

Create three one-time purchase products in your Polar organization:

#### Product 1: 10 AI Analysis Credits

- **Name**: AI Analysis Credits - Starter Pack
- **Price**: $3.00 USD
- **Type**: One-time purchase
- **Description**: 10 AI analysis credits for code debugging and optimization

#### Product 2: 50 AI Analysis Credits

- **Name**: AI Analysis Credits - Value Pack
- **Price**: $15.00 USD
- **Type**: One-time purchase
- **Description**: 50 AI analysis credits for regular usage

#### Product 3: 100 AI Analysis Credits

- **Name**: AI Analysis Credits - Power Pack
- **Price**: $30.00 USD
- **Type**: One-time purchase
- **Description**: 100 AI analysis credits for heavy usage

### 2. Configure Webhook Endpoint

1. Go to your Polar Organization Settings
2. Navigate to Webhooks section
3. Add a new webhook endpoint: `https://yourdomain.com/api/auth/polar/webhooks` to simulate webhook endpoint of dev localhost:3000 use ngrok library
4. Select the following events:
   - `order.paid`
   - `customer.created`
   - `customer.updated`
5. Copy the webhook secret and add it to your environment variables

### 3. Get Product IDs

After creating the products, copy their IDs from the Polar dashboard and add them to your environment variables as shown above.

## Database Schema

The system adds the following fields to the User model:

- `freeAnalysisUsed`: Number of free analyses used (max 10)
- `paidCredits`: Number of paid credits available
- `totalAnalysisCount`: Total analyses performed
- `analysisHistory`: Relationship to analysis history records

## How It Works

### User Flow

1. **New users** get 10 free AI analysis sessions
2. **After free credits are exhausted**, users must purchase credit packages
3. **Each AI analysis** consumes 1 credit (equivalent to $0.30)
4. **Credits are tracked** in the database and never expire

### Payment Flow

1. User clicks "Buy Credits" when they need more
2. System redirects to Polar checkout
3. Upon successful payment, webhook automatically adds credits to user account
4. User can immediately use their new credits

### Credit Consumption

1. Before each AI analysis, system checks if user has available credits
2. If credits available, system consumes 1 credit and proceeds with analysis
3. If no credits available, system prompts user to purchase more
4. All usage is tracked in the `analysisHistory` table

## API Endpoints

The system provides these API endpoints:

- `GET /api/credits/check` - Check user's available credits
- `GET /api/credits/stats` - Get detailed credit statistics
- `POST /api/credits/consume` - Consume credits for analysis

## Testing

To test the system:

1. Ensure your Polar organization is in sandbox mode during development
2. Use Polar's test payment methods
3. Verify webhook delivery in Polar dashboard
4. Check database records after test purchases

## Production Deployment

Before going live:

1. Switch Polar configuration from 'sandbox' to 'production' in `auth.ts`
2. Update webhook URLs to production domain
3. Test the complete flow with real payments
4. Monitor webhook delivery and error handling

## Troubleshooting

### Common Issues

1. **Webhook not working**: Check webhook URL and secret configuration
2. **Credits not added**: Verify product IDs match in environment variables
3. **Payment not processing**: Ensure Polar is in correct mode (sandbox/production)

### Logs to Check

- Webhook payload logs in application console
- Polar webhook delivery logs in dashboard
- Database transaction logs for credit updates
