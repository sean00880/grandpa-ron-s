import { PrismaClient } from './generated/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Load blog registry from centralized source of truth
function loadBlogRegistry() {
  const registryPath = path.join(__dirname, '../.growsz/registries/blog-content.json');
  if (fs.existsSync(registryPath)) {
    const content = fs.readFileSync(registryPath, 'utf-8');
    return JSON.parse(content);
  }
  return null;
}

async function main() {
  console.log('Seeding database...');

  // Load registry for SEO-optimized content
  const registry = loadBlogRegistry();
  if (registry) {
    console.log('Loaded blog registry from .growsz/registries/blog-content.json');
  }

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

  const lawnCareTipsCategory = await prisma.blogCategory.upsert({
    where: { slug: 'lawn-care-tips' },
    update: {},
    create: {
      slug: 'lawn-care-tips',
      name: 'Lawn Care Tips',
      description: 'Expert advice for maintaining a healthy, beautiful lawn',
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

  const seasonalGuidesCategory = await prisma.blogCategory.upsert({
    where: { slug: 'seasonal-guides' },
    update: {},
    create: {
      slug: 'seasonal-guides',
      name: 'Seasonal Guides',
      description: 'Comprehensive guides for lawn care throughout the year in Ohio and Kentucky',
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

  // ============================================
  // REGISTRY-BASED SEO-OPTIMIZED POSTS
  // These posts are referenced in the BlogSection component
  // ============================================

  // Additional tags needed for registry posts
  const additionalTags = await Promise.all([
    prisma.blogTag.upsert({
      where: { slug: 'grass-types' },
      update: {},
      create: { slug: 'grass-types', name: 'Grass Types' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'ohio' },
      update: {},
      create: { slug: 'ohio', name: 'Ohio' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'kentucky' },
      update: {},
      create: { slug: 'kentucky', name: 'Kentucky' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'edging' },
      update: {},
      create: { slug: 'edging', name: 'Edging' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'soil-health' },
      update: {},
      create: { slug: 'soil-health', name: 'Soil Health' },
    }),
  ]);

  const allTags = [...tags, ...additionalTags];
  console.log('Created additional tags:', additionalTags.length);

  // Post: Spring Lawn Preparation Guide (SEO-optimized)
  const springLawnPost = await prisma.blogPost.upsert({
    where: { slug: 'spring-lawn-preparation-guide' },
    update: {
      title: 'Complete Spring Lawn Preparation Guide for Ohio & Kentucky',
      excerpt: 'Get your lawn ready for the growing season with our comprehensive spring preparation checklist. Expert tips from Grandpa Ron\'s 40+ years of experience.',
      coverImage: '/img/grass.jpg',
      metaTitle: 'Spring Lawn Preparation Guide 2026 | Ohio & Kentucky Lawn Care',
      metaDescription: 'Complete spring lawn preparation checklist for Ohio and Kentucky homeowners. Learn when to fertilize, dethatch, and apply pre-emergent. Expert tips from local pros.',
      keywords: 'spring lawn care ohio, lawn preparation kentucky, spring fertilizer schedule, pre-emergent herbicide timing, dethatching lawn spring',
      content: `## Why Spring Lawn Care Matters in Ohio & Kentucky

After a long Ohio winter, your lawn needs some TLC to bounce back strong. Spring is the perfect time to set your lawn up for success throughout the growing season. Here in the Ohio Valley, we typically see soil temperatures reach the critical 55°F threshold by mid-March to early April.

## Step 1: Clean Up Winter Debris

Start by removing any fallen branches, leaves, and debris that accumulated over winter. This allows your grass to breathe and receive sunlight.

**Pro Tip from Grandpa Ron:** Walk your property on a dry day after the last frost. Look for matted grass areas—these can develop snow mold if not addressed.

## Step 2: Rake and Dethatch Your Lawn

Light raking helps remove thatch buildup and stimulates grass growth. Be gentle to avoid damaging new growth.

**When to Dethatch:**
- If thatch layer exceeds ½ inch
- Best done when grass is actively growing
- For Ohio/Kentucky: Late April to early May

## Step 3: Test Your Soil

A soil test tells you exactly what nutrients your lawn needs. Most Ohio and Kentucky lawns benefit from lime applications to balance pH levels.

**Local Insight:** Ohio State University Extension offers affordable soil testing. Kentucky homeowners can use the University of Kentucky Cooperative Extension.

## Step 4: Apply Pre-Emergent Herbicide

Apply pre-emergent herbicide before soil temperatures reach 55°F consistently. This prevents crabgrass and other weeds from taking hold.

**Timing for Our Region:**
- Cincinnati area: March 15-April 1
- Columbus area: March 20-April 5
- Lexington area: March 10-March 25

## Step 5: Fertilize at the Right Time

Wait until your lawn is actively growing before applying fertilizer. Early spring fertilization can encourage weed growth.

**Best Practice:** Apply a balanced fertilizer (like 20-5-10) once grass has been mowed 2-3 times.

## Step 6: Overseed Bare Spots

Spring is an excellent time for seeding cool-season grasses in Kentucky and Ohio.

**Best Grass Seed Mixes for Our Region:**
- Kentucky Bluegrass (primary)
- Tall Fescue (drought-tolerant areas)
- Perennial Ryegrass (quick germination)

## Step 7: Service Your Mower

Before the first cut, sharpen your mower blade and change the oil. A dull blade tears grass, creating brown tips and inviting disease.

## Need Professional Help?

Contact Grandpa Ron's Lawncare for professional spring cleanup and preparation services. We've been serving Ohio and Kentucky families for over 40 years. Our team knows exactly what your lawn needs to thrive in our unique climate.

**Services include:**
- Spring cleanup and debris removal
- Core aeration
- Dethatching
- Fertilizer application
- Pre-emergent weed treatment
- Overseeding and bare spot repair`,
    },
    create: {
      slug: 'spring-lawn-preparation-guide',
      title: 'Complete Spring Lawn Preparation Guide for Ohio & Kentucky',
      excerpt: 'Get your lawn ready for the growing season with our comprehensive spring preparation checklist. Expert tips from Grandpa Ron\'s 40+ years of experience.',
      coverImage: '/img/grass.jpg',
      author: 'Grandpa Ron',
      publishedAt: new Date('2024-03-15'),
      status: 'published',
      metaTitle: 'Spring Lawn Preparation Guide 2026 | Ohio & Kentucky Lawn Care',
      metaDescription: 'Complete spring lawn preparation checklist for Ohio and Kentucky homeowners. Learn when to fertilize, dethatch, and apply pre-emergent. Expert tips from local pros.',
      keywords: 'spring lawn care ohio, lawn preparation kentucky, spring fertilizer schedule, pre-emergent herbicide timing, dethatching lawn spring',
      readTime: 8,
      categoryId: seasonalGuidesCategory.id,
      content: `## Why Spring Lawn Care Matters in Ohio & Kentucky

After a long Ohio winter, your lawn needs some TLC to bounce back strong. Spring is the perfect time to set your lawn up for success throughout the growing season. Here in the Ohio Valley, we typically see soil temperatures reach the critical 55°F threshold by mid-March to early April.

## Step 1: Clean Up Winter Debris

Start by removing any fallen branches, leaves, and debris that accumulated over winter. This allows your grass to breathe and receive sunlight.

**Pro Tip from Grandpa Ron:** Walk your property on a dry day after the last frost. Look for matted grass areas—these can develop snow mold if not addressed.

## Step 2: Rake and Dethatch Your Lawn

Light raking helps remove thatch buildup and stimulates grass growth. Be gentle to avoid damaging new growth.

**When to Dethatch:**
- If thatch layer exceeds ½ inch
- Best done when grass is actively growing
- For Ohio/Kentucky: Late April to early May

## Step 3: Test Your Soil

A soil test tells you exactly what nutrients your lawn needs. Most Ohio and Kentucky lawns benefit from lime applications to balance pH levels.

**Local Insight:** Ohio State University Extension offers affordable soil testing. Kentucky homeowners can use the University of Kentucky Cooperative Extension.

## Step 4: Apply Pre-Emergent Herbicide

Apply pre-emergent herbicide before soil temperatures reach 55°F consistently. This prevents crabgrass and other weeds from taking hold.

**Timing for Our Region:**
- Cincinnati area: March 15-April 1
- Columbus area: March 20-April 5
- Lexington area: March 10-March 25

## Step 5: Fertilize at the Right Time

Wait until your lawn is actively growing before applying fertilizer. Early spring fertilization can encourage weed growth.

**Best Practice:** Apply a balanced fertilizer (like 20-5-10) once grass has been mowed 2-3 times.

## Step 6: Overseed Bare Spots

Spring is an excellent time for seeding cool-season grasses in Kentucky and Ohio.

**Best Grass Seed Mixes for Our Region:**
- Kentucky Bluegrass (primary)
- Tall Fescue (drought-tolerant areas)
- Perennial Ryegrass (quick germination)

## Step 7: Service Your Mower

Before the first cut, sharpen your mower blade and change the oil. A dull blade tears grass, creating brown tips and inviting disease.

## Need Professional Help?

Contact Grandpa Ron's Lawncare for professional spring cleanup and preparation services. We've been serving Ohio and Kentucky families for over 40 years. Our team knows exactly what your lawn needs to thrive in our unique climate.

**Services include:**
- Spring cleanup and debris removal
- Core aeration
- Dethatching
- Fertilizer application
- Pre-emergent weed treatment
- Overseeding and bare spot repair`,
    },
  });

  // Post: Best Grass Types for Ohio & Kentucky
  const grassTypesPost = await prisma.blogPost.upsert({
    where: { slug: 'best-grass-types-kentucky' },
    update: {
      title: 'Best Grass Types for Ohio & Kentucky Lawns in 2026',
      excerpt: 'Discover which grass varieties thrive in Ohio and Kentucky\'s climate and how to choose the right one for your yard. Complete guide with pros, cons, and care tips.',
      coverImage: '/img/IMG_1960.JPG',
      metaTitle: 'Best Grass Types for Ohio & Kentucky Lawns 2026 | Expert Guide',
      metaDescription: 'Find the perfect grass for your Ohio or Kentucky lawn. Compare Kentucky Bluegrass, Tall Fescue, and Perennial Ryegrass. Local expert recommendations.',
      keywords: 'best grass type ohio, kentucky bluegrass lawn, tall fescue ohio, grass seed kentucky, cool season grass ohio valley',
    },
    create: {
      slug: 'best-grass-types-kentucky',
      title: 'Best Grass Types for Ohio & Kentucky Lawns in 2026',
      excerpt: 'Discover which grass varieties thrive in Ohio and Kentucky\'s climate and how to choose the right one for your yard. Complete guide with pros, cons, and care tips.',
      coverImage: '/img/IMG_1960.JPG',
      author: 'Grandpa Ron',
      publishedAt: new Date('2024-03-10'),
      status: 'published',
      metaTitle: 'Best Grass Types for Ohio & Kentucky Lawns 2026 | Expert Guide',
      metaDescription: 'Find the perfect grass for your Ohio or Kentucky lawn. Compare Kentucky Bluegrass, Tall Fescue, and Perennial Ryegrass. Local expert recommendations.',
      keywords: 'best grass type ohio, kentucky bluegrass lawn, tall fescue ohio, grass seed kentucky, cool season grass ohio valley',
      readTime: 6,
      categoryId: lawnCareTipsCategory.id,
      content: `## Understanding Ohio & Kentucky's Climate for Grass Selection

Ohio and Kentucky sit in the transition zone between warm and cool-season grasses, which means we have unique challenges—and opportunities—when choosing lawn grass. Our humid summers, cold winters, and variable rainfall create the perfect environment for cool-season grasses.

## Top 5 Grass Types for Our Region

### 1. Kentucky Bluegrass (Poa pratensis)

**Best For:** Full sun lawns, high-traffic areas, premium appearance

**Pros:**
- Beautiful dark green color
- Self-repairing through rhizomes
- Cold-hardy for Ohio winters
- Dense growth chokes out weeds

**Cons:**
- Requires more water than other varieties
- Slow to establish from seed
- Goes dormant in summer drought

**Care Level:** Moderate to High

**Grandpa Ron's Take:** "Kentucky Bluegrass is the gold standard for a reason. If you're willing to put in the work, nothing looks better in a Cincinnati or Lexington front yard."

### 2. Tall Fescue (Festuca arundinacea)

**Best For:** Low-maintenance lawns, partial shade, drought-prone areas

**Pros:**
- Deep root system (drought tolerant)
- Handles shade better than bluegrass
- Low fertilizer requirements
- Stays green longer in summer

**Cons:**
- Bunch-type growth (doesn't spread)
- Can look coarse compared to bluegrass
- Requires overseeding to fill gaps

**Care Level:** Low to Moderate

**Best Varieties for 2026:** Titan Rx, Regenerate, Raptor II

### 3. Perennial Ryegrass (Lolium perenne)

**Best For:** Quick establishment, overseeding, high-traffic sports areas

**Pros:**
- Germinates in 5-7 days
- Fine texture, dark green color
- Excellent wear tolerance
- Perfect for overseeding bare spots

**Cons:**
- Shallow roots (drought sensitive)
- Less cold-hardy than bluegrass
- Won't spread to fill gaps

**Care Level:** Moderate

### 4. Fine Fescues (Creeping Red, Chewings, Hard)

**Best For:** Deep shade, low-maintenance areas, slopes

**Pros:**
- Best shade tolerance of cool-season grasses
- Very low fertilizer needs
- Drought tolerant once established
- Fine, soft texture

**Cons:**
- Doesn't handle heavy foot traffic
- Can thin out in full sun
- May require specialized care

**Care Level:** Low

### 5. Grass Seed Blends (Our Top Recommendation)

**Best For:** Most Ohio and Kentucky lawns

**Why Blends Work Best:**
A quality blend combines the strengths of multiple grass types. For our region, look for:
- 50-60% Kentucky Bluegrass
- 30-40% Tall Fescue
- 10-20% Perennial Ryegrass

## Choosing Based on Your Yard Conditions

| Condition | Best Choice |
|-----------|-------------|
| Full Sun (6+ hours) | Kentucky Bluegrass or KBG/Fescue blend |
| Partial Shade (4-6 hours) | Tall Fescue or Fine Fescue blend |
| Deep Shade (under 4 hours) | Fine Fescues |
| High Traffic (kids, pets) | Perennial Ryegrass + Kentucky Bluegrass |
| Drought-Prone / No Irrigation | Tall Fescue |
| Premium Appearance | Kentucky Bluegrass (pure or dominant blend) |

## When to Plant in Ohio & Kentucky

**Fall (Best Time):** September 1 - October 15
- Soil still warm for germination
- Cooler air reduces stress on seedlings
- Fewer weed competition

**Spring (Second Best):** April 15 - May 15
- Apply pre-emergent 6-8 weeks before seeding
- Be ready to water frequently

## Need Help Choosing?

Grandpa Ron's Lawncare offers free lawn consultations. We'll assess your soil, sun exposure, and usage patterns to recommend the perfect grass type for your property. Call us at (220) 666-2520 or request a quote online.`,
    },
  });

  // Post: DIY Garden Bed Edging
  const diyEdgingPost = await prisma.blogPost.upsert({
    where: { slug: 'diy-garden-bed-edging' },
    update: {
      title: 'DIY Garden Bed Edging Ideas: 12 Budget-Friendly Projects',
      excerpt: 'Transform your garden beds with these creative and budget-friendly edging projects you can do yourself. Step-by-step instructions with local material sourcing tips.',
      coverImage: '/img/IMG_1974.JPG',
      metaTitle: '12 DIY Garden Bed Edging Ideas 2026 | Budget-Friendly Projects',
      metaDescription: 'Create beautiful garden bed edges on a budget. 12 DIY edging projects with step-by-step instructions. Tips for Ohio and Kentucky soil conditions.',
      keywords: 'diy garden edging ideas, cheap garden border, lawn edging diy, flower bed edging ohio, landscape edging ideas budget',
    },
    create: {
      slug: 'diy-garden-bed-edging',
      title: 'DIY Garden Bed Edging Ideas: 12 Budget-Friendly Projects',
      excerpt: 'Transform your garden beds with these creative and budget-friendly edging projects you can do yourself. Step-by-step instructions with local material sourcing tips.',
      coverImage: '/img/IMG_1974.JPG',
      author: 'Grandpa Ron',
      publishedAt: new Date('2024-03-05'),
      status: 'published',
      metaTitle: '12 DIY Garden Bed Edging Ideas 2026 | Budget-Friendly Projects',
      metaDescription: 'Create beautiful garden bed edges on a budget. 12 DIY edging projects with step-by-step instructions. Tips for Ohio and Kentucky soil conditions.',
      keywords: 'diy garden edging ideas, cheap garden border, lawn edging diy, flower bed edging ohio, landscape edging ideas budget',
      readTime: 10,
      categoryId: diyCategory.id,
      content: `## Why Garden Bed Edging Matters

Clean garden bed edges do more than look great—they prevent grass from invading your flower beds, reduce maintenance time, and increase your home's curb appeal. Here are 12 DIY edging projects ranging from free to under $100.

## Budget-Friendly Edging Ideas

### 1. Trench Edging (FREE)

**Cost:** Free (just labor)
**Difficulty:** Easy
**Time:** 1-2 hours per 20 feet

**How to Create:**
1. Use a half-moon edger or flat shovel
2. Cut a 4-6 inch deep V-shaped trench
3. Angle the bed-side wall at 45 degrees
4. Remove grass and debris from trench

**Grandpa Ron's Tip:** "This is what we used back in the day, and it's still the cleanest look. Just re-cut edges twice a year in spring and fall."

### 2. Recycled Brick Edging ($0-50)

**Cost:** Free if salvaged, $0.50-1.00 per brick new
**Difficulty:** Easy
**Time:** 2-3 hours per 20 feet

**How to Create:**
1. Dig a trench 4 inches deep, width of brick + 1 inch
2. Add 1 inch of sand for leveling
3. Set bricks end-to-end or at 45-degree angle
4. Tap into place with rubber mallet

**Local Tip:** Check Facebook Marketplace in Columbus, Cincinnati, and Lexington for free salvaged bricks from demolitions.

### 3. Natural Stone Border ($20-80)

**Cost:** $20-80 depending on stone type
**Difficulty:** Easy
**Time:** 2-4 hours per 20 feet

**Ohio/Kentucky Stone Options:**
- Fieldstone (often free from farmers)
- Ohio limestone ($30-50 per project)
- River rock from local suppliers

### 4. Steel Landscape Edging ($40-80)

**Cost:** $40-80 for 20 feet
**Difficulty:** Moderate
**Time:** 2-3 hours per 20 feet

**Pros:** Clean modern look, lasts 20+ years, easy curves
**Cons:** Requires cutting, can be sharp during installation

**Installation Tips:**
1. Use heavy gloves—steel edges are sharp
2. Overlap connectors 6 inches minimum
3. Drive stakes every 4 feet and at connections

### 5. Wood Log Edging ($0-30)

**Cost:** Free with fallen logs, $20-30 for cedar
**Difficulty:** Easy
**Time:** 1-2 hours per 20 feet

**Best Woods for Our Climate:**
- Cedar (rot-resistant, 10-15 years)
- Black locust (extremely durable)
- Avoid pine without treatment

### 6. Concrete Paver Edge ($50-100)

**Cost:** $50-100 for 20 feet
**Difficulty:** Moderate
**Time:** 3-4 hours per 20 feet

**Modern Options:**
- Tumbled pavers (antique look)
- Bullnose pavers (smooth curves)
- Interlocking styles (easy install)

### 7. Plastic Pound-In Edging ($15-30)

**Cost:** $15-30 for 20 feet
**Difficulty:** Very Easy
**Time:** 30 minutes - 1 hour per 20 feet

**Best For:** Quick solutions, rental properties
**Note:** Less durable than other options (3-5 years)

### 8. Mulch Moat Edging (FREE)

**Cost:** Free (uses existing mulch)
**Difficulty:** Easy
**Time:** 1 hour per 20 feet

Create a 3-4 inch "moat" of mulch between lawn and beds. Re-apply mulch annually.

### 9. Aluminum Edging ($60-100)

**Cost:** $60-100 for 20 feet
**Difficulty:** Moderate
**Time:** 2-3 hours per 20 feet

**Pros:** Never rusts, professional look, tight curves possible

### 10. Woven Willow/Branch Border ($0-20)

**Cost:** Free with yard materials, $20 for purchased willow
**Difficulty:** Moderate (requires weaving skill)
**Time:** 4-6 hours per 20 feet

**Cottage Garden Style:** Creates a charming, rustic look perfect for Ohio farmhouse aesthetics.

### 11. Concrete Curb (Poured) ($80-150)

**Cost:** $80-150 for 20 feet
**Difficulty:** Advanced
**Time:** Full day project

**Permanent Solution:** Lasts 30+ years with proper installation

### 12. Rubber Mulch Border ($40-70)

**Cost:** $40-70 for 20 feet
**Difficulty:** Very Easy
**Time:** 30 minutes per 20 feet

**Eco-Friendly:** Made from recycled tires, won't decompose

## Tools You'll Need

**Basic Edging Kit:**
- Half-moon edger or flat spade
- Rubber mallet
- Level (4-foot)
- Garden stakes and string
- Work gloves

## When to Edge in Ohio & Kentucky

**Best Times:**
- **Spring (April-May):** Ideal—soil is workable, grass hasn't spread
- **Fall (September-October):** Good for preparation before winter

**Avoid:** Frozen ground (winter), extremely wet soil (early spring)

## Professional Edging Services

Not ready for a DIY project? Grandpa Ron's Lawncare offers professional edging installation and maintenance. We can create clean, lasting edges that require minimal upkeep.

**Our edging services include:**
- Consultation on best materials for your style
- Professional installation
- Annual edge maintenance programs
- Mulch and bed renovation`,
    },
  });

  // Post: Lawn Mowing Height Guide
  const mowingHeightPost = await prisma.blogPost.upsert({
    where: { slug: 'lawn-mowing-height-guide' },
    update: {
      title: 'The Ultimate Lawn Mowing Height Guide for Ohio & Kentucky',
      excerpt: 'Learn the optimal mowing heights for different grass types and seasons to keep your lawn healthy. Plus: the one-third rule explained.',
      coverImage: '/img/IMG_1971.JPG',
      metaTitle: 'Lawn Mowing Height Guide 2026 | Ohio & Kentucky Grass Types',
      metaDescription: 'Optimal mowing heights for Kentucky Bluegrass, Tall Fescue, and more. Seasonal adjustments for Ohio and Kentucky lawns. The one-third rule explained.',
      keywords: 'lawn mowing height ohio, grass cutting height guide, how tall to cut kentucky bluegrass, best mowing height summer, tall fescue mowing height',
    },
    create: {
      slug: 'lawn-mowing-height-guide',
      title: 'The Ultimate Lawn Mowing Height Guide for Ohio & Kentucky',
      excerpt: 'Learn the optimal mowing heights for different grass types and seasons to keep your lawn healthy. Plus: the one-third rule explained.',
      coverImage: '/img/IMG_1971.JPG',
      author: 'Grandpa Ron',
      publishedAt: new Date('2024-02-28'),
      status: 'published',
      metaTitle: 'Lawn Mowing Height Guide 2026 | Ohio & Kentucky Grass Types',
      metaDescription: 'Optimal mowing heights for Kentucky Bluegrass, Tall Fescue, and more. Seasonal adjustments for Ohio and Kentucky lawns. The one-third rule explained.',
      keywords: 'lawn mowing height ohio, grass cutting height guide, how tall to cut kentucky bluegrass, best mowing height summer, tall fescue mowing height',
      readTime: 5,
      categoryId: lawnCareTipsCategory.id,
      content: `## Why Mowing Height Matters

Mowing at the correct height is one of the most important—and most often ignored—aspects of lawn care. Cut too short, and you stress your grass, invite weeds, and create a patchy lawn. Cut too high, and your lawn looks unkempt and can develop thatch problems.

## The One-Third Rule

**Never remove more than one-third of the grass blade in a single mowing.**

This rule prevents stress on your lawn and keeps it healthy. Here's what that looks like:

| If You Want This Height | Mow When Grass Reaches |
|------------------------|------------------------|
| 2.5 inches | 3.75 inches |
| 3 inches | 4.5 inches |
| 3.5 inches | 5.25 inches |
| 4 inches | 6 inches |

## Optimal Heights by Grass Type

### Kentucky Bluegrass

**Recommended Height:** 2.5 - 3.5 inches

| Season | Height | Why |
|--------|--------|-----|
| Spring | 2.5-3" | Encourages density |
| Summer | 3-3.5" | Shades roots, retains moisture |
| Fall | 2.5-3" | Prepares for winter |
| Last Mow | 2-2.5" | Prevents snow mold |

### Tall Fescue

**Recommended Height:** 3 - 4 inches

| Season | Height | Why |
|--------|--------|-----|
| Spring | 3" | Promotes tillering |
| Summer | 3.5-4" | Deep roots = drought survival |
| Fall | 3" | Prepares for dormancy |

**Grandpa Ron's Tip:** "Tall fescue's deep roots are its superpower. Keep it taller in summer, and you won't need to water as often."

### Perennial Ryegrass

**Recommended Height:** 2 - 3 inches

- More tolerant of shorter cuts
- Maintain 2.5" for dense, dark green appearance
- Don't cut below 1.5" or you'll weaken the plant

### Fine Fescues

**Recommended Height:** 2.5 - 4 inches

- Can be left unmowed for natural meadow look
- For manicured appearance, keep at 2.5-3"

## Seasonal Mowing Guide for Ohio & Kentucky

### Spring (April - May)

**Start mowing when grass reaches 3-4 inches**

1. First mow: Remove no more than 1/3
2. Gradually lower height over 2-3 mowings
3. Target: 2.5-3" for most lawns

### Summer (June - August)

**Raise your mower deck!**

- Increase height by 0.5-1 inch
- Taller grass shades soil, reducing water needs
- Never mow during drought stress

**Summer Heat Advisory:** When temps exceed 90°F for multiple days, consider skipping a mowing session rather than stressing your lawn.

### Fall (September - October)

**Return to spring heights**

- Gradually lower mowing height
- Keep up with falling leaves
- Last mow: Drop to 2-2.5" to prevent snow mold

### Winter (November - March)

**No mowing needed in Ohio/Kentucky**

- Grass goes dormant below 50°F
- Avoid walking on frozen grass

## Common Mowing Mistakes

### 1. Scalping the Lawn

**Problem:** Cutting more than 1/3 of blade, exposing soil
**Solution:** Raise mower deck, mow more frequently

### 2. Mowing Wet Grass

**Problems:**
- Uneven cut
- Clumps that smother grass
- Disease spread
- Slipping hazard

**Solution:** Wait until grass is dry (late morning best)

### 3. Dull Mower Blades

**Problem:** Tears grass instead of cutting, brown tips
**Solution:** Sharpen blades every 8-10 mowing hours

### 4. Same Pattern Every Time

**Problem:** Soil compaction, grass leans one direction
**Solution:** Alternate mowing direction each time

## Mowing Frequency by Season

| Season | Ohio/Kentucky Frequency |
|--------|------------------------|
| Spring (peak growth) | Every 4-5 days |
| Early Summer | Every 5-7 days |
| Mid-Summer (heat) | Every 7-10 days |
| Fall | Every 5-7 days |

## Should You Bag or Mulch Clippings?

**Mulch (leave clippings) in most cases:**
- Returns nitrogen to soil
- Reduces fertilizer needs by 25%
- Saves time

**Bag when:**
- Grass is diseased
- Clippings are excessive (wet or overgrown)
- You're seeding (clippings can smother seed)

## Professional Mowing Services

Grandpa Ron's Lawncare offers weekly and bi-weekly mowing services throughout Ohio and Kentucky. Our crews are trained in proper mowing height and techniques for our regional grass types.

**What's included:**
- Proper height adjustment for season
- Sharp blade cutting
- Mulching or bagging (your choice)
- Edging and trimming
- Debris cleanup`,
    },
  });

  console.log('Created registry-based SEO posts:', [
    springLawnPost.slug,
    grassTypesPost.slug,
    diyEdgingPost.slug,
    mowingHeightPost.slug,
  ]);

  // Connect registry posts to tags
  const registryTagMappings = [
    { postId: springLawnPost.id, tagSlugs: ['spring', 'fertilizing', 'weed-control', 'ohio', 'kentucky'] },
    { postId: grassTypesPost.id, tagSlugs: ['grass-types', 'ohio', 'kentucky', 'soil-health'] },
    { postId: diyEdgingPost.id, tagSlugs: ['edging', 'spring', 'summer'] },
    { postId: mowingHeightPost.id, tagSlugs: ['mowing', 'grass-types', 'summer', 'ohio', 'kentucky'] },
  ];

  for (const mapping of registryTagMappings) {
    for (const tagSlug of mapping.tagSlugs) {
      const tag = allTags.find((t) => t.slug === tagSlug);
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

  console.log('Connected registry posts to tags');

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
