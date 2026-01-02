import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CalendarDays, Clock, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Blog - Lawn Care Tips & Guides",
  description: "Expert lawn care tips, seasonal guides, and DIY landscaping projects from Grandpa Ron's Lawncare.",
}

// Sample blog posts - in production, fetch from CMS/database
const blogPosts = [
  {
    slug: "spring-lawn-preparation-guide",
    title: "Complete Spring Lawn Preparation Guide",
    excerpt: "Get your lawn ready for the growing season with our comprehensive spring preparation checklist.",
    category: "Seasonal Guides",
    categorySlug: "seasonal-guides",
    date: "March 15, 2024",
    readTime: "8 min read",
    image: "/blog/spring-lawn.jpg",
  },
  {
    slug: "best-grass-types-kentucky",
    title: "Best Grass Types for Kentucky Lawns",
    excerpt: "Discover which grass varieties thrive in Kentucky's climate and how to choose the right one for your yard.",
    category: "Lawn Care Tips",
    categorySlug: "lawn-care-tips",
    date: "March 10, 2024",
    readTime: "6 min read",
    image: "/blog/grass-types.jpg",
  },
  {
    slug: "diy-garden-bed-edging",
    title: "DIY Garden Bed Edging Ideas",
    excerpt: "Transform your garden beds with these creative and budget-friendly edging projects you can do yourself.",
    category: "DIY Projects",
    categorySlug: "diy-projects",
    date: "March 5, 2024",
    readTime: "10 min read",
    image: "/blog/garden-edging.jpg",
  },
  {
    slug: "lawn-mowing-height-guide",
    title: "The Ultimate Lawn Mowing Height Guide",
    excerpt: "Learn the optimal mowing heights for different grass types and seasons to keep your lawn healthy.",
    category: "Lawn Care Tips",
    categorySlug: "lawn-care-tips",
    date: "February 28, 2024",
    readTime: "5 min read",
    image: "/blog/mowing-height.jpg",
  },
  {
    slug: "fall-leaf-removal-tips",
    title: "Fall Leaf Removal: Best Practices",
    excerpt: "Don't let fallen leaves damage your lawn. Here's how to efficiently manage leaf removal this autumn.",
    category: "Seasonal Guides",
    categorySlug: "seasonal-guides",
    date: "February 20, 2024",
    readTime: "7 min read",
    image: "/blog/leaf-removal.jpg",
  },
  {
    slug: "build-raised-garden-bed",
    title: "How to Build a Raised Garden Bed",
    excerpt: "Step-by-step instructions for building a durable raised garden bed that will last for years.",
    category: "DIY Projects",
    categorySlug: "diy-projects",
    date: "February 15, 2024",
    readTime: "12 min read",
    image: "/blog/raised-bed.jpg",
  },
]

const categories = [
  { name: "All Posts", slug: "", count: blogPosts.length },
  { name: "Lawn Care Tips", slug: "lawn-care-tips", count: blogPosts.filter(p => p.categorySlug === "lawn-care-tips").length },
  { name: "Seasonal Guides", slug: "seasonal-guides", count: blogPosts.filter(p => p.categorySlug === "seasonal-guides").length },
  { name: "DIY Projects", slug: "diy-projects", count: blogPosts.filter(p => p.categorySlug === "diy-projects").length },
]

export default function BlogPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Lawn Care Blog</h1>
        <p className="text-muted-foreground">
          Expert tips, seasonal guides, and DIY projects to help you maintain a beautiful lawn.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.slug ? `/blog/category/${category.slug}` : "/blog"}
          >
            <Badge
              variant={category.slug === "" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category.name} ({category.count})
            </Badge>
          </Link>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Badge className="absolute top-3 left-3" variant="secondary">
                {post.category}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  Read
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter CTA */}
      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle>Stay Updated</CardTitle>
          <CardDescription>
            Get lawn care tips and seasonal reminders delivered to your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border bg-background"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
