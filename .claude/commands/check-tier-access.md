# Check Tier Access and Features

Check what features are available for a specific tier using the centralized PRICING_REGISTRY.

## Steps:

1. Request the tier ID (free, customer, provider, provider-pro, enterprise)
2. Load the PRICING_REGISTRY from `.growsz/registries/PRICING_REGISTRY.ts`
3. Display:
   - Tier name and description
   - Monthly and annual pricing
   - Annual savings
   - All available features
   - Usage limits
   - Recommended for (customer type)

4. Optionally compare with other tiers

## Example Usage:

```
/check-tier-access provider-pro
```

## Output Format:

```
Provider Pro Tier
-----------------
Price: $79.99/month ($799/year - Save $160.88!)

Features:
✅ Featured listing
✅ Priority booking
✅ Analytics dashboard
✅ Customer reviews
✅ Before/after gallery
✅ Video portfolio
✅ Instant quotes
✅ Recurring services
✅ AI quote assistant
✅ AI property analysis
✅ AI scheduling optimization
✅ Team management (up to 10 members)

Limits:
- 200 services per month
- 10 team members

Perfect for: Growing lawn care businesses ready to scale
```

## Registry Integration:

Always use `PRICING_REGISTRY` for tier information - never hardcode pricing or features.
