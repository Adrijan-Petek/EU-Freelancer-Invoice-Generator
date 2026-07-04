# Monetization Setup

## Pricing Suggestion

- Starter: Free
- Pro: 5 EUR per month

## PayPal Setup

1. Create a PayPal Business account.
2. Create subscription products in PayPal.
3. Copy checkout links for each plan.
4. Put links and subscription IDs in .env.local:

```env
NEXT_PUBLIC_PAYPAL_STARTER_URL=https://your-paypal-link
NEXT_PUBLIC_PAYPAL_PRO_URL=https://your-paypal-link
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_PAYPAL_PLAN_ID=your_subscription_plan_id
```

## Current Plan Configuration

- Plan type: Fixed pricing
- Plan name: EU Freelancer Invoice Generator
- Plan ID: P-39E65640L2122282RNJEQJAY
- Setup fee: 0.00 EUR
- Billing: every 1 month
- Amount: 5.00 EUR
- Billing cycles: unlimited
- Taxes: none
- Pause after missed cycles: 0
- Auto-bill outstanding: enabled

## App Integration

- Pricing page is available at /pricing.
- Buttons read PayPal links from environment variables.
- Pro plan also renders PayPal SDK subscription button from NEXT_PUBLIC_PAYPAL_CLIENT_ID and NEXT_PUBLIC_PAYPAL_PLAN_ID.
- If links are empty, buttons are disabled to avoid broken checkout.

## Next Step For Full Pro Locking

- Add user authentication.
- Store subscription state in database.
- Add webhook endpoint for PayPal events.
- Gate Pro-only features by active subscription state.
