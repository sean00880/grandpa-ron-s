import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CalendarDays, Clock, Share2, User, Eye, Tag } from "lucide-react"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts, incrementViewCount } from "@/lib/blog"
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Dynamic rendering for blog posts (ISR pattern)
// This allows posts to be updated without full rebuild
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

// Generate SEO metadata from database
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    }
  }

  // Use SEO fields from database, fallback to standard fields
  const metaTitle = post.metaTitle || post.title
  const metaDescription = post.metaDescription || post.excerpt || ''
  const keywords = post.keywords || ''

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}

// Format date for display
function formatDate(date: Date | null): string {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  // Show "Coming Soon" page if database isn't available
  if (!post) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="max-w-3xl">
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">Lawn Care Tips</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Professional lawn care advice from Grandpa Ron&apos;s Lawncare
            </p>
          </header>

          <div className="aspect-video bg-muted rounded-lg mb-8 flex items-center justify-center">
            <p className="text-muted-foreground">Featured image coming soon</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              This article is being prepared by our lawn care experts. Check back soon for comprehensive tips and guides on lawn care, landscaping, and seasonal maintenance for Ohio and Kentucky homeowners.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              In the meantime, contact us for a free quote on our professional lawn care services!
            </p>
          </div>

          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Need Professional Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Let Grandpa Ron&apos;s Lawncare handle your lawn care needs. We offer professional services throughout Ohio and Kentucky.
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
      </div>
    )
  }

  // Increment view count (fire and forget)
  incrementViewCount(post.id).catch(console.error)

  // Get related posts from same category (excluding current post)
  const allPosts = await getAllPosts({ status: 'published', limit: 10 })
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id)
    .filter(p => p.categoryId === post.categoryId ||
      p.tags.some(t => post.tags.some(pt => pt.tag.id === t.tag.id)))
    .slice(0, 3)

  // If not enough related posts, fill with recent posts
  if (relatedPosts.length < 3) {
    const remaining = allPosts
      .filter(p => p.id !== post.id && !relatedPosts.find(rp => rp.id === p.id))
      .slice(0, 3 - relatedPosts.length)
    relatedPosts.push(...remaining)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            author: {
              '@type': 'Person',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: "Grandpa Ron's Lawncare",
              logo: {
                '@type': 'ImageObject',
                url: '/logo.png',
              },
            },
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt?.toISOString(),
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `/blog/${slug}`,
            },
            keywords: post.keywords,
          }),
        }}
      />

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
          {post.category && (
            <Badge variant="secondary" className="mb-4">
              <Link href={`/blog/category/${post.category.slug}`}>
                {post.category.name}
              </Link>
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.viewCount} views
            </span>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {post.coverImage && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
              >
                <Tag className="h-3 w-3" />
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {post.content?.split('\n').map((paragraph, i) => {
            // Handle headers
            if (paragraph.startsWith('### ')) {
              return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{paragraph.replace('### ', '')}</h3>
            }
            if (paragraph.startsWith('## ')) {
              return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>
            }
            // Handle list items
            if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
              return (
                <li key={i} className="ml-6 mb-2 text-muted-foreground">
                  {paragraph.replace(/^[-*]\s/, '')}
                </li>
              )
            }
            // Handle numbered list items
            if (/^\d+\.\s/.test(paragraph)) {
              return (
                <li key={i} className="ml-6 mb-2 text-muted-foreground list-decimal">
                  {paragraph.replace(/^\d+\.\s/, '')}
                </li>
              )
            }
            // Handle bold text markers
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return <p key={i} className="mb-4 font-semibold">{paragraph.replace(/\*\*/g, '')}</p>
            }
            // Regular paragraphs
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
              Let Grandpa Ron&apos;s Lawncare handle your lawn care needs. We offer professional services throughout Ohio and Kentucky.
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
      {relatedPosts.length > 0 && (
        <aside className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related Articles</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <Card key={related.slug} className="hover:shadow-md transition-shadow overflow-hidden">
                <CardHeader className="p-0">
                  {related.coverImage ? (
                    <div className="relative aspect-video">
                      <Image
                        src={related.coverImage}
                        alt={related.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted" />
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  {related.category && (
                    <Badge variant="outline" className="mb-2 text-xs">
                      {related.category.name}
                    </Badge>
                  )}
                  <CardTitle className="text-lg line-clamp-2">
                    <Link href={`/blog/${related.slug}`} className="hover:text-primary transition-colors">
                      {related.title}
                    </Link>
                  </CardTitle>
                  {related.readTime && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {related.readTime} min read
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </aside>
      )}
    </div>
  )
}
