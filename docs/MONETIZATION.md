# Monetization Setup

## Pricing Suggestion

- Starter: Free
- Pro: 9 EUR per month

## PayPal Setup

1. Create a PayPal Business account.
2. Create subscription products in PayPal.
3. Copy checkout links for each plan.
4. Put links in .env.local:

```env
NEXT_PUBLIC_PAYPAL_STARTER_URL=https://your-paypal-link
NEXT_PUBLIC_PAYPAL_PRO_URL=https://your-paypal-link
```

## App Integration

- Pricing page is available at /pricing.
- Buttons read PayPal links from environment variables.
- If links are empty, buttons are disabled to avoid broken checkout.

## Next Step For Full Pro Locking

- Add user authentication.
- Store subscription state in database.
- Add webhook endpoint for PayPal events.
- Gate Pro-only features by active subscription state.
