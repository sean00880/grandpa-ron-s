import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Clock, Share2, User } from "lucide-react"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Sample post data - in production, fetch from CMS/database
async function getPost(slug: string) {
  const posts: Record<string, {
    title: string
    excerpt: string
    content: string
    category: string
    categorySlug: string
    date: string
    readTime: string
    author: string
  }> = {
    "spring-lawn-preparation-guide": {
      title: "Complete Spring Lawn Preparation Guide",
      excerpt: "Get your lawn ready for the growing season with our comprehensive spring preparation checklist.",
      content: `
## Why Spring Lawn Care Matters

After a long winter, your lawn needs some TLC to bounce back strong. Spring is the perfect time to set your lawn up for success throughout the growing season.

## Step 1: Clean Up Debris

Start by removing any fallen branches, leaves, and debris that accumulated over winter. This allows your grass to breathe and receive sunlight.

## Step 2: Rake and Dethatch

Light raking helps remove thatch buildup and stimulates grass growth. Be gentle to avoid damaging new growth.

## Step 3: Test Your Soil

A soil test tells you exactly what nutrients your lawn needs. Most Kentucky lawns benefit from lime applications to balance pH levels.

## Step 4: Apply Pre-Emergent

Apply pre-emergent herbicide before soil temperatures reach 55°F consistently. This prevents crabgrass and other weeds from taking hold.

## Step 5: Fertilize Appropriately

Wait until your lawn is actively growing before applying fertilizer. Early spring fertilization can encourage weed growth.

## Step 6: Address Bare Spots

Overseed any bare or thin areas. Spring is an excellent time for seeding cool-season grasses in Kentucky.

## Need Help?

Contact Grandpa Ron's Lawncare for professional spring cleanup and preparation services. We'll get your lawn ready for the best growing season yet!
      `,
      category: "Seasonal Guides",
      categorySlug: "seasonal-guides",
      date: "March 15, 2024",
      readTime: "8 min read",
      author: "Grandpa Ron",
    },
  }

  return posts[slug] || {
    title: "Blog Post",
    excerpt: "This is a sample blog post.",
    content: "Content coming soon...",
    category: "Lawn Care Tips",
    categorySlug: "lawn-care-tips",
    date: "January 1, 2024",
    readTime: "5 min read",
    author: "Grandpa Ron",
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  const relatedPosts = [
    { slug: "best-grass-types-kentucky", title: "Best Grass Types for Kentucky Lawns" },
    { slug: "lawn-mowing-height-guide", title: "The Ultimate Lawn Mowing Height Guide" },
    { slug: "fall-leaf-removal-tips", title: "Fall Leaf Removal: Best Practices" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Article */}
      <article className="max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4">
            <Link href={`/blog/category/${post.categorySlug}`}>
              {post.category}
            </Link>
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </header>

        {/* Featured Image Placeholder */}
        <div className="aspect-video bg-muted rounded-lg mb-8" />

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {post.content.split('\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>
            }
            if (paragraph.trim()) {
              return <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{paragraph}</p>
            }
            return null
          })}
        </div>

        {/* CTA */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Need Professional Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Let Grandpa Ron&apos;s Lawncare handle your lawn care needs. We offer professional services throughout Kentucky.
            </p>
            <Link
              href="/quote"
              className="inline-flex px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Get a Free Quote
            </Link>
          </CardContent>
        </Card>
      </article>

      {/* Related Posts */}
      <aside className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Articles</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {relatedPosts.map((related) => (
            <Card key={related.slug} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="aspect-video bg-muted rounded-md mb-2" />
                <CardTitle className="text-lg">
                  <Link href={`/blog/${related.slug}`} className="hover:text-primary transition-colors">
                    {related.title}
                  </Link>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </aside>
    </div>
  )
}
