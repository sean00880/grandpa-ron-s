import { prisma } from './prisma';
import type { BlogPost, BlogCategory, BlogTag } from '../prisma/generated/client';

// Type for BlogPost with relations
export type BlogPostWithRelations = BlogPost & {
  category: BlogCategory | null;
  tags: {
    tag: BlogTag;
  }[];
};

// Options for getAllPosts
export interface GetAllPostsOptions {
  limit?: number;
  status?: string;
}

/**
 * Get all blog posts with optional filtering
 * @param options - Optional filters for limit and status
 * @returns Array of blog posts with category and tags
 */
export async function getAllPosts(
  options?: GetAllPostsOptions
): Promise<BlogPostWithRelations[]> {
  const { limit, status } = options ?? {};

  const posts = await prisma.blogPost.findMany({
    where: status ? { status } : undefined,
    take: limit,
    orderBy: {
      publishedAt: 'desc',
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return posts;
}

/**
 * Get a single blog post by its slug
 * @param slug - The unique slug identifier for the post
 * @returns The blog post with category and tags, or null if not found
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPostWithRelations | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return post;
}

/**
 * Get all blog posts in a specific category
 * @param categorySlug - The slug of the category to filter by
 * @returns Array of blog posts in the specified category
 */
export async function getPostsByCategory(
  categorySlug: string
): Promise<BlogPostWithRelations[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
      status: 'published',
    },
    orderBy: {
      publishedAt: 'desc',
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return posts;
}

/**
 * Get all blog categories
 * @returns Array of all blog categories
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  const categories = await prisma.blogCategory.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return categories;
}

/**
 * Get all blog tags
 * @returns Array of all blog tags
 */
export async function getAllTags(): Promise<BlogTag[]> {
  const tags = await prisma.blogTag.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return tags;
}

/**
 * Increment the view count for a blog post
 * @param postId - The ID of the post to increment views for
 */
export async function incrementViewCount(postId: string): Promise<void> {
  await prisma.blogPost.update({
    where: { id: postId },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
}

/**
 * Get posts by tag slug
 * @param tagSlug - The slug of the tag to filter by
 * @returns Array of blog posts with the specified tag
 */
export async function getPostsByTag(
  tagSlug: string
): Promise<BlogPostWithRelations[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      tags: {
        some: {
          tag: {
            slug: tagSlug,
          },
        },
      },
      status: 'published',
    },
    orderBy: {
      publishedAt: 'desc',
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return posts;
}

/**
 * Search blog posts by title or content
 * @param query - The search query string
 * @returns Array of matching blog posts
 */
export async function searchPosts(
  query: string
): Promise<BlogPostWithRelations[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
        { excerpt: { contains: query } },
      ],
      status: 'published',
    },
    orderBy: {
      publishedAt: 'desc',
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return posts;
}
