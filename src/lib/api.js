import { normalizeSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

// Helper to get base URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser should use relative path
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return 'http://localhost:3000';
};

export async function getCategories() {
  // Use Prisma directly on server
  if (typeof window === 'undefined') {
    try {
      return await prisma.category.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      });
    } catch (error) {
      console.error('Prisma error fetching categories:', error);
      return [];
    }
  }

  // Fallback for client-side
  try {
    const res = await fetch(`${getBaseUrl()}/api/categories`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getPosts(options = {}) {
  const { categoryId = null, section = null, order = null, q = null, location = null, lat = null, lng = null, limit = 10 } = options;
  
  // Use Prisma directly on server
  if (typeof window === 'undefined') {
    try {
      const where = {
        status: "PUBLISHED",
      };

      if (categoryId) where.categoryId = categoryId;
      if (section) where.section = section.toUpperCase();
      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }
      if (q) {
        where.OR = [
          { title: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
          { excerpt: { contains: q, mode: 'insensitive' } },
        ];
      }

      const posts = await prisma.post.findMany({
        where,
        take: Number(limit) || 10,
        orderBy: order ? { [order]: 'desc' } : { createdAt: 'desc' },
        include: {
          category: true,
          author: {
            select: { name: true }
          }
        }
      });
      return JSON.parse(JSON.stringify(posts)); // Ensure plain objects
    } catch (error) {
      console.error('Prisma error fetching posts:', error);
      return [];
    }
  }

  // Fallback for client-side
  let url = `${getBaseUrl()}/api/posts?limit=${limit}`;
  if (categoryId) url += `&category=${categoryId}`;
  if (section) url += `&section=${section}`;
  if (order) url += `&order=${order}`;
  if (q) url += `&q=${encodeURIComponent(q)}`;
  if (location) url += `&location=${encodeURIComponent(location)}`;
  if (lat !== null && lng !== null) {
    url += `&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
  }
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return await res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPopularWeek() {
  // Use Prisma directly on server
  if (typeof window === 'undefined') {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const posts = await prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          createdAt: { gte: oneWeekAgo },
        },
        take: 5,
        orderBy: { views: { _count: 'desc' } }, // Note: simplified views logic
        include: { category: true }
      });
      return JSON.parse(JSON.stringify(posts));
    } catch (error) {
      // Fallback if views count relation is complex
      return [];
    }
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/posts/popular-week`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("Failed to fetch popular posts");
    return await res.json();
  } catch (error) {
    console.error("Error fetching popular week:", error);
    return [];
  }
}

export async function getPost(slug) {
  const key = normalizeSlug(slug);
  if (!key) return null;

  // Use Prisma directly on server
  if (typeof window === 'undefined') {
    try {
      const post = await prisma.post.findUnique({
        where: { slug: key },
        include: {
          category: true,
          author: {
            select: { name: true }
          },
          tags: {
            include: { tag: true }
          }
        }
      });
      return post ? JSON.parse(JSON.stringify(post)) : null;
    } catch (error) {
      console.error('Prisma error fetching post:', error);
      return null;
    }
  }

  try {
    const url = `${getBaseUrl()}/api/posts?slug=${encodeURIComponent(key)}&publishedOnly=1`;
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

