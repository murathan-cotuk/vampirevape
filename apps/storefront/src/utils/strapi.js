/**
 * Strapi CMS API utilities
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Fetch from Strapi API
 */
export async function strapiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Strapi API Error:', error);
    throw error;
  }
}

/**
 * Fetch blog posts
 */
export async function getBlogPosts({ limit = 10, start = 0 } = {}) {
  const data = await strapiFetch(
    `/blog-posts?pagination[limit]=${limit}&pagination[start]=${start}&sort=publishedAt:desc`
  );
  return data;
}

/**
 * Fetch single blog post by slug
 */
export async function getBlogPostBySlug(slug) {
  const data = await strapiFetch(
    `/blog-posts?filters[slug][$eq]=${slug}&populate=*`
  );
  return data.data?.[0] || null;
}

/**
 * Fetch lexikon entries
 */
export async function getLexikonEntries({ limit = 20 } = {}) {
  const data = await strapiFetch(
    `/lexikon-entries?pagination[limit]=${limit}&sort=title:asc`
  );
  return data;
}

/**
 * Fetch single lexikon entry by slug
 */
export async function getLexikonEntryBySlug(slug) {
  const data = await strapiFetch(
    `/lexikon-entries?filters[slug][$eq]=${slug}&populate=*`
  );
  return data.data?.[0] || null;
}

/**
 * Fetch static pages
 */
export async function getStaticPage(slug) {
  const data = await strapiFetch(
    `/static-pages?filters[slug][$eq]=${slug}&populate=*`
  );
  return data.data?.[0] || null;
}

