import { normalizeSlug } from "@/lib/slug";

// Helper to get base URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser should use relative path
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return 'http://localhost:3000';
};

export async function getCategories() {
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
  try {
    const key = normalizeSlug(slug);
    if (!key) return null;

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
