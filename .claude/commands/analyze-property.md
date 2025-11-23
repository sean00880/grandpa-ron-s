# Analyze Property Images for Service Estimation

Analyze property images to estimate lawn care service needs using AI.

## Steps:

1. Request the property image path or URL from the user
2. Use Google Generative AI (Gemini Pro Vision) to analyze the image
3. Identify:
   - Property size and lawn area
   - Lawn condition (healthy, needs care, overgrown)
   - Obstacles (trees, slopes, garden features)
   - Recommended services (mowing, tree trimming, landscaping)
   - Estimated service frequency
4. Generate a detailed property analysis report
5. Suggest next steps for the customer

## Example Usage:

```
/analyze-property path/to/property-image.jpg
```

## AI Prompt Template:

Use the property-analyzer agent from `.growsz/registries/AGENT_REGISTRY.ts` for consistent analysis across the platform.
