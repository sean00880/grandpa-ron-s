import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Blog Categories
  const lawnCareCategory = await prisma.blogCategory.upsert({
    where: { slug: 'lawn-care' },
    update: {},
    create: {
      slug: 'lawn-care',
      name: 'Lawn Care',
      description: 'Tips and guides for maintaining a beautiful lawn',
    },
  });

  const landscapingCategory = await prisma.blogCategory.upsert({
    where: { slug: 'landscaping' },
    update: {},
    create: {
      slug: 'landscaping',
      name: 'Landscaping',
      description: 'Design ideas and landscaping inspiration',
    },
  });

  const seasonalCategory = await prisma.blogCategory.upsert({
    where: { slug: 'seasonal-tips' },
    update: {},
    create: {
      slug: 'seasonal-tips',
      name: 'Seasonal Tips',
      description: 'Seasonal lawn and garden maintenance advice',
    },
  });

  const diyCategory = await prisma.blogCategory.upsert({
    where: { slug: 'diy-projects' },
    update: {},
    create: {
      slug: 'diy-projects',
      name: 'DIY Projects',
      description: 'Do-it-yourself lawn and garden projects',
    },
  });

  console.log('Created categories:', {
    lawnCareCategory,
    landscapingCategory,
    seasonalCategory,
    diyCategory,
  });

  // Create Blog Tags
  const tags = await Promise.all([
    prisma.blogTag.upsert({
      where: { slug: 'mowing' },
      update: {},
      create: { slug: 'mowing', name: 'Mowing' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'fertilizing' },
      update: {},
      create: { slug: 'fertilizing', name: 'Fertilizing' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'watering' },
      update: {},
      create: { slug: 'watering', name: 'Watering' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'weed-control' },
      update: {},
      create: { slug: 'weed-control', name: 'Weed Control' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'spring' },
      update: {},
      create: { slug: 'spring', name: 'Spring' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'summer' },
      update: {},
      create: { slug: 'summer', name: 'Summer' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'fall' },
      update: {},
      create: { slug: 'fall', name: 'Fall' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'winter' },
      update: {},
      create: { slug: 'winter', name: 'Winter' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'mulching' },
      update: {},
      create: { slug: 'mulching', name: 'Mulching' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'aeration' },
      update: {},
      create: { slug: 'aeration', name: 'Aeration' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'beginner' },
      update: {},
      create: { slug: 'beginner', name: 'Beginner' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'professional-tips' },
      update: {},
      create: { slug: 'professional-tips', name: 'Professional Tips' },
    }),
  ]);

  console.log('Created tags:', tags.length);

  // Create Blog Posts
  const post1 = await prisma.blogPost.upsert({
    where: { slug: 'ultimate-spring-lawn-care-guide' },
    update: {},
    create: {
      slug: 'ultimate-spring-lawn-care-guide',
      title: 'The Ultimate Spring Lawn Care Guide',
      excerpt: 'Get your lawn ready for the growing season with our comprehensive spring lawn care checklist.',
      content: `
# The Ultimate Spring Lawn Care Guide

Spring is the perfect time to give your lawn the attention it needs after a long winter. Follow these steps to ensure a lush, green lawn all season long.

## 1. Clean Up Debris

Start by raking up leaves, twigs, and other debris that accumulated over winter. This allows sunlight and air to reach your grass.

## 2. Test Your Soil

Before fertilizing, test your soil's pH level. Most grasses thrive in soil with a pH between 6.0 and 7.0. You can purchase a soil test kit at your local garden center.

## 3. Aerate Your Lawn

Core aeration helps relieve soil compaction and allows water, nutrients, and air to penetrate the roots. This is especially important if your lawn sees heavy foot traffic.

## 4. Overseed Bare Patches

Spring is an excellent time to fill in bare or thin areas. Choose a grass seed that matches your existing lawn and keep it moist until established.

## 5. Apply Pre-Emergent Herbicide

Prevent crabgrass and other weeds by applying a pre-emergent herbicide when soil temperatures reach about 55 degrees Fahrenheit.

## 6. Start Mowing

Once your grass starts growing, begin mowing. Set your mower to a higher setting - about 3 inches - to encourage deeper root growth.

## 7. Water Wisely

Deep, infrequent watering is better than frequent shallow watering. Aim for about 1 inch of water per week, including rainfall.

---

*Need professional help with your spring lawn care? Contact Grandpa Ron's Lawn Service for a free quote!*
      `.trim(),
      coverImage: '/img/lawn.jpeg',
      author: 'Grandpa Ron',
      publishedAt: new Date('2024-03-15'),
      status: 'published',
      metaTitle: 'Ultimate Spring Lawn Care Guide | Grandpa Ron',
      metaDescription: 'Complete spring lawn care checklist: aeration, fertilizing, weed control, and more. Expert tips from Grandpa Ron.',
      keywords: 'spring lawn care, lawn maintenance, aeration, fertilizing, weed control',
      readTime: 8,
      categoryId: seasonalCategory.id,
    },
  });

  const post2 = await prisma.blogPost.upsert({
    where: { slug: 'how-to-choose-right-fertilizer' },
    update: {},
    create: {
      slug: 'how-to-choose-right-fertilizer',
      title: 'How to Choose the Right Fertilizer for Your Lawn',
      excerpt: 'Understanding NPK ratios and choosing the perfect fertilizer for your grass type.',
      content: `
# How to Choose the Right Fertilizer for Your Lawn

Fertilizer is essential for a healthy lawn, but with so many options available, choosing the right one can be overwhelming. Let's break it down.

## Understanding NPK Ratios

Every fertilizer has three numbers on the bag (like 10-10-10 or 20-5-10). These represent:

- **N (Nitrogen)**: Promotes green, leafy growth
- **P (Phosphorus)**: Supports root development
- **K (Potassium)**: Helps with overall plant health and stress resistance

## Types of Fertilizer

### Quick-Release (Synthetic)
- Fast results
- Lower cost
- Requires more frequent applications
- Risk of burning lawn if over-applied

### Slow-Release (Controlled)
- Steady feeding over 6-12 weeks
- Less risk of burning
- More convenient - fewer applications needed

### Organic
- Improves soil structure over time
- Environmentally friendly
- Takes longer to see results
- Often more expensive

## When to Fertilize

| Season | Goal | Recommended NPK |
|--------|------|-----------------|
| Spring | Green up | Higher nitrogen (25-5-10) |
| Summer | Maintenance | Balanced (10-10-10) |
| Fall | Root growth | Higher phosphorus (10-20-10) |

## Tips for Application

1. Always water your lawn before and after fertilizing
2. Apply in the morning or evening to avoid burning
3. Use a spreader for even coverage
4. Follow package directions - more is not better!

---

*Not sure what your lawn needs? Our experts can help! Schedule a free lawn assessment today.*
      `.trim(),
      coverImage: '/img/garden.png',
      author: 'Grandpa Ron',
      publishedAt: new Date('2024-04-02'),
      status: 'published',
      metaTitle: 'Choosing the Right Lawn Fertilizer | Expert Guide',
      metaDescription: 'Learn how to choose the perfect fertilizer for your lawn. Understand NPK ratios, types of fertilizer, and when to apply.',
      keywords: 'lawn fertilizer, NPK ratio, organic fertilizer, lawn care tips',
      readTime: 6,
      categoryId: lawnCareCategory.id,
    },
  });

  const post3 = await prisma.blogPost.upsert({
    where: { slug: 'mulching-benefits-guide' },
    update: {},
    create: {
      slug: 'mulching-benefits-guide',
      title: '10 Benefits of Mulching Your Garden Beds',
      excerpt: 'Discover why mulching is one of the best things you can do for your garden and landscape.',
      content: `
# 10 Benefits of Mulching Your Garden Beds

Mulch is one of the most versatile and beneficial additions to any garden. Here's why every homeowner should be mulching their landscape beds.

## 1. Moisture Retention

Mulch acts like a blanket, reducing evaporation and helping soil retain moisture. This means less watering and healthier plants.

## 2. Weed Suppression

A 2-4 inch layer of mulch blocks sunlight from reaching weed seeds, dramatically reducing weed growth.

## 3. Temperature Regulation

Mulch insulates soil, keeping it cooler in summer and warmer in winter. This protects plant roots from extreme temperatures.

## 4. Soil Improvement

Organic mulches break down over time, adding valuable nutrients and improving soil structure.

## 5. Erosion Prevention

Mulch protects soil from heavy rain and wind, preventing erosion on slopes and in garden beds.

## 6. Enhanced Curb Appeal

Fresh mulch gives landscapes a clean, polished look that increases property value.

## 7. Pest Control

Some mulches (like cedar) naturally repel certain insects and pests.

## 8. Disease Prevention

Mulch creates a barrier between soil-borne pathogens and plant foliage.

## 9. Root Protection

The cushioning effect of mulch protects roots from lawn equipment and foot traffic.

## 10. Cost Savings

Less watering, fewer weeds, and healthier plants mean less money spent on lawn care overall.

## Types of Mulch

- **Hardwood**: Long-lasting, neutral color
- **Pine bark**: Acidic, great for azaleas and hydrangeas
- **Cedar**: Natural pest repellent, aromatic
- **Rubber**: Permanent, good for playgrounds

---

*Ready to transform your landscape with fresh mulch? Get a free mulching quote from Grandpa Ron's!*
      `.trim(),
      coverImage: '/img/mulch.jpg',
      author: 'Grandpa Ron',
      publishedAt: new Date('2024-04-20'),
      status: 'published',
      metaTitle: '10 Benefits of Mulching | Garden Care Guide',
      metaDescription: 'Learn the top 10 benefits of mulching your garden beds. From weed control to soil improvement - discover why mulch matters.',
      keywords: 'mulching benefits, garden mulch, landscape mulching, weed control',
      readTime: 5,
      categoryId: landscapingCategory.id,
    },
  });

  const post4 = await prisma.blogPost.upsert({
    where: { slug: 'fall-lawn-winterization' },
    update: {},
    create: {
      slug: 'fall-lawn-winterization',
      title: 'Preparing Your Lawn for Winter: A Complete Guide',
      excerpt: 'Essential fall tasks to ensure your lawn survives winter and thrives in spring.',
      content: `
# Preparing Your Lawn for Winter: A Complete Guide

The work you do in fall determines how your lawn looks next spring. Follow this guide to winterize your lawn properly.

## Why Fall Lawn Care Matters

Your lawn is preparing for dormancy, storing energy in its roots for the winter. Proper fall care helps it survive cold temperatures and bounce back quickly in spring.

## Essential Fall Tasks

### 1. Continue Mowing

Don't stop mowing just because growth slows. Gradually lower your mowing height with each cut until you reach about 2 inches.

### 2. Remove Leaves

A thick layer of leaves can smother grass and promote disease. Rake or mulch-mow them before they mat down.

### 3. Aerate

Fall aeration prepares soil for winter by improving drainage and reducing compaction.

### 4. Overseed

Cool-season grasses establish best in fall. Overseed thin areas while temperatures are still mild.

### 5. Apply Fall Fertilizer

A winterizer fertilizer (high in potassium) strengthens roots and improves cold tolerance.

### 6. Address Weeds

Fall is the best time to treat perennial weeds. They're actively storing nutrients in their roots, making them more susceptible to herbicides.

## Timing Is Everything

| Task | Best Time |
|------|-----------|
| Aeration | Early fall (Sept) |
| Overseeding | Early-mid fall |
| Fall fertilizer | Late fall (Oct-Nov) |
| Final mowing | When growth stops |

## Common Mistakes to Avoid

- Leaving leaves on the lawn too long
- Cutting grass too short at once
- Skipping fall fertilization
- Ignoring weeds until spring

---

*Let us handle your fall lawn prep! Contact Grandpa Ron's for professional winterization services.*
      `.trim(),
      coverImage: '/img/tree.jpg',
      author: 'Grandpa Ron',
      publishedAt: new Date('2024-09-15'),
      status: 'published',
      metaTitle: 'Fall Lawn Winterization Guide | Prepare Your Lawn',
      metaDescription: 'Complete guide to fall lawn care and winterization. Learn essential tasks to prepare your lawn for winter.',
      keywords: 'fall lawn care, winterization, lawn prep, aeration, overseeding',
      readTime: 7,
      categoryId: seasonalCategory.id,
    },
  });

  const post5 = await prisma.blogPost.upsert({
    where: { slug: 'diy-garden-edging-ideas' },
    update: {},
    create: {
      slug: 'diy-garden-edging-ideas',
      title: '8 DIY Garden Edging Ideas on a Budget',
      excerpt: 'Creative and affordable ways to define your garden beds and add curb appeal.',
      content: `
# 8 DIY Garden Edging Ideas on a Budget

Sharp, defined edges make any landscape look professionally maintained. Here are budget-friendly edging ideas you can do yourself.

## 1. Natural Stone Border

Stack flat stones along bed edges for a timeless, organic look. Check local classifieds for free stones from people clearing their property.

**Cost**: $0-50

## 2. Brick Edging

Reclaimed bricks create a classic cottage garden feel. Set them at an angle for a sawtooth pattern or flat for a clean line.

**Cost**: $20-100

## 3. Landscape Timber

Pressure-treated 4x4 timbers are affordable and easy to install. Just stake them in place with rebar.

**Cost**: $3-5 per linear foot

## 4. Plastic Edging

Not glamorous, but effective. Modern plastic edging is nearly invisible once installed and very durable.

**Cost**: $1-2 per linear foot

## 5. River Rock Border

A row of river rocks adds texture and works beautifully with modern landscapes.

**Cost**: $30-60 per 50 lb bag

## 6. Wine Bottle Border

Bury wine bottles neck-down for a unique, eco-friendly edge. Great for cottage gardens.

**Cost**: Free (just drink more wine!)

## 7. Metal Edging

Steel or aluminum edging creates crisp, modern lines. Rusted steel (Cor-ten) is particularly trendy.

**Cost**: $2-4 per linear foot

## 8. Trench Edging

Sometimes the simplest solution is best. A clean-cut trench between lawn and bed costs nothing but time.

**Cost**: Free

## Installation Tips

1. Always mark your edges with a garden hose or string first
2. Cut a clean line with an edging tool
3. Remove 2-3 inches of turf where edging will go
4. Set edging material in place and backfill as needed

---

*Need help with your landscape edging? We offer professional installation at competitive prices!*
      `.trim(),
      coverImage: '/img/gardening.jpg',
      author: 'Grandpa Ron',
      publishedAt: new Date('2024-05-10'),
      status: 'published',
      metaTitle: 'DIY Garden Edging Ideas | Budget-Friendly Guide',
      metaDescription: '8 creative DIY garden edging ideas that won\'t break the bank. Budget-friendly ways to define your garden beds.',
      keywords: 'garden edging, DIY landscaping, budget landscaping, curb appeal',
      readTime: 6,
      categoryId: diyCategory.id,
    },
  });

  console.log('Created posts:', [post1.slug, post2.slug, post3.slug, post4.slug, post5.slug]);

  // Connect posts to tags
  const tagMappings = [
    { postId: post1.id, tagSlugs: ['spring', 'aeration', 'mowing', 'watering', 'beginner'] },
    { postId: post2.id, tagSlugs: ['fertilizing', 'professional-tips', 'beginner'] },
    { postId: post3.id, tagSlugs: ['mulching', 'professional-tips'] },
    { postId: post4.id, tagSlugs: ['fall', 'winter', 'aeration', 'fertilizing', 'mowing'] },
    { postId: post5.id, tagSlugs: ['beginner'] },
  ];

  for (const mapping of tagMappings) {
    for (const tagSlug of mapping.tagSlugs) {
      const tag = tags.find((t) => t.slug === tagSlug);
      if (tag) {
        await prisma.blogPostTag.upsert({
          where: {
            postId_tagId: {
              postId: mapping.postId,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            postId: mapping.postId,
            tagId: tag.id,
          },
        });
      }
    }
  }

  console.log('Connected posts to tags');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
