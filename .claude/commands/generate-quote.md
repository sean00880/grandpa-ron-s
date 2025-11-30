# Generate Service Quote

Generate an instant quote for lawn care services using AI quote assistant.

## Steps:

1. Gather customer requirements:
   - Service type (lawn mowing, tree cutting, mulching, etc.)
   - Property size (sq ft or acres)
   - Service frequency (one-time, weekly, bi-weekly, monthly)
   - Location/zip code
   - Special requirements

2. Use the `quote-assistant` agent from `.growsz/registries/AGENT_REGISTRY.ts`

3. Calculate estimate based on:
   - Regional pricing data
   - Property size and complexity
   - Service frequency
   - Seasonal factors
   - Provider availability

4. Generate quote with:
   - Total cost breakdown
   - Service timeline
   - Recommended providers
   - Payment options

5. Format as customer-friendly quote document

## Example Usage:

```
/generate-quote
```

Then provide details interactively or all at once:

```
Service: lawn mowing
Size: 5000 sq ft
Frequency: bi-weekly
Location: 12345
```

## AI Integration:

Uses Google Generative AI with the quote-assistant system prompt for consistent, accurate quotes.
