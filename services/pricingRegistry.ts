import { PricingItem } from '../types';

export const pricingRegistry: PricingItem[] = [
  { id: 'sod', service: 'Sod Installation (Kentucky Bluegrass)', unit: 'sq ft', unitPrice: 1.50, category: 'material' },
  { id: 'seed', service: 'Overseeding', unit: 'sq ft', unitPrice: 0.25, category: 'service' },
  { id: 'mulch', service: 'Premium Hardwood Mulch', unit: 'cu yard', unitPrice: 85.00, category: 'material' },
  { id: 'mow', service: 'Precision Mowing', unit: 'acre', unitPrice: 60.00, category: 'service' },
  { id: 'pavers', service: 'Stone Paver Walkway', unit: 'sq ft', unitPrice: 22.00, category: 'material' },
  { id: 'cleaning', service: 'Garden Bed Cleanout', unit: 'hour', unitPrice: 75.00, category: 'labor' },
  { id: 'tree_trim', service: 'Tree Trimming/Pruning', unit: 'tree', unitPrice: 150.00, category: 'service' },
  { id: 'planting', service: 'Shrub Planting', unit: 'plant', unitPrice: 45.00, category: 'labor' },
  { id: 'gravel', service: 'Decorative Gravel', unit: 'sq ft', unitPrice: 5.00, category: 'material' },
  { id: 'lighting', service: 'Landscape Lighting Install', unit: 'fixture', unitPrice: 120.00, category: 'material' },
  { id: 'fence', service: 'Wood Fence Installation', unit: 'linear ft', unitPrice: 35.00, category: 'material' }
];

export const getPricingSummary = () => {
  return pricingRegistry.map(p => `- ${p.service}: $${p.unitPrice.toFixed(2)} per ${p.unit}`).join('\n');
};