/**
 * Shopify Storefront API utilities
 */

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
const STOREFRONT_API_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
const API_VERSION = '2024-10';

const storefrontApiUrl = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

/**
 * Execute GraphQL query to Shopify Storefront API
 */
export async function shopifyFetch({ query, variables = {} }) {
  if (!STOREFRONT_API_TOKEN) {
    const error = new Error(
      'NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN is not set. ' +
      'Please check your environment variables. ' +
      'In Vercel, go to Settings → Environment Variables and add NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN.'
    );
    console.error(error.message);
    throw error;
  }

  try {
    const response = await fetch(storefrontApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store', // Prevent caching in development
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify GraphQL Errors:', data.errors);
      throw new Error(JSON.stringify(data.errors));
    }

    return data.data;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}

/**
 * Fetch products from Shopify
 */
export async function getProducts({ collection = null, limit = 20, cursor = null } = {}) {
  const query = `
    query getProducts($first: Int!, $after: String, $collection: String) {
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            metafields(first: 50) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                  type
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const variables = {
    first: limit,
    after: cursor,
  };

  return await shopifyFetch({ query, variables });
}

/**
 * Fetch single product by handle
 */
export async function getProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
              selectedOptions {
                name
                value
              }
            }
          }
        }
        metafields(identifiers: [
          {namespace: "custom", key: "ml"},
          {namespace: "custom", key: "volume"},
          {namespace: "custom", key: "inhalt"},
          {namespace: "custom", key: "flavor"},
          {namespace: "custom", key: "nicotine_strength"},
          {namespace: "custom", key: "eigenschaften"},
          {namespace: "custom", key: "hersteller"},
          {namespace: "custom", key: "verantwortlich"},
          {namespace: "custom", key: "informationsunterlagen"},
          {namespace: "custom", key: "clp"},
          {namespace: "custom", key: "reach"},
          {namespace: "custom", key: "produktnummer"},
          {namespace: "custom", key: "sku"},
          {namespace: "custom", key: "weee"},
          {namespace: "custom", key: "reg"}
        ]) {
          id
          namespace
          key
          value
          type
        }
      }
    }
  `;

  return await shopifyFetch({ query, variables: { handle } });
}

/**
 * Fetch collections
 */
export async function getCollections({ limit = 20 } = {}) {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  return await shopifyFetch({ query, variables: { first: limit } });
}

/**
 * Fetch collection by handle
 */
export async function getCollectionByHandle(handle) {
  const query = `
    query getCollection($handle: String!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        image {
          url
          altText
        }
        metafields(identifiers: [{namespace: "custom", key: "category_banner"}]) {
          id
          namespace
          key
          value
          type
        }
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              vendor
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                    quantityAvailable
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              metafields(identifiers: [
                {namespace: "custom", key: "ml"},
                {namespace: "custom", key: "volume"},
                {namespace: "custom", key: "inhalt"},
                {namespace: "custom", key: "flavor"},
                {namespace: "custom", key: "nicotine_strength"}
              ]) {
                id
                namespace
                key
                value
                type
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  return await shopifyFetch({ query, variables: { handle } });
}

/**
 * Fetch menu from Shopify Storefront API
 * Content > Menus altından oluşturulan menüleri çeker
 * Storefront API'de menu query'si mevcut!
 */
export async function getShopifyMenu(menuHandle = 'main-menu-1') {
  const query = `
    query getMenu($handle: String!) {
      menu(handle: $handle) {
        id
        title
        items {
          id
          title
          url
          type
          items {
            id
            title
            url
            type
            items {
              id
              title
              url
              type
            }
          }
        }
      }
    }
  `;

  try {
    // Try main-menu-1 first, then fallback to main-menu
    let data = await shopifyFetch({ 
      query, 
      variables: { handle: menuHandle } 
    });

    let menu = data?.menu;

    // If main-menu-1 doesn't exist, try main-menu
    if (!menu && menuHandle === 'main-menu-1') {
      data = await shopifyFetch({ 
        query, 
        variables: { handle: 'main-menu' } 
      });
      menu = data?.menu;
    }

    if (!menu) {
      console.warn(`Menu with handle "${menuHandle}" not found`);
      return { menu: null };
    }

    // Recursively process menu items
    const processMenuItems = (items) => {
      if (!items || items.length === 0) return [];
      return items.map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        type: item.type,
        items: processMenuItems(item.items || []),
      }));
    };

    return {
      menu: {
        id: menu.id,
        title: menu.title,
        handle: menuHandle,
        items: processMenuItems(menu.items || []),
      },
    };
  } catch (error) {
    console.error('Failed to fetch Shopify menu:', error);
    return { menu: null };
  }
}

/**
 * Fetch store metafields (for banners, settings, etc.)
 * Store metafields are accessible via the shop query
 */
export async function getStoreMetafields(namespace = 'hero', keys = []) {
  if (keys.length === 0) {
    return [];
  }

  // Build identifiers array for GraphQL
  const identifiers = keys.map(key => ({
    namespace,
    key
  }));

  const query = `
    query getStoreMetafields($identifiers: [HasMetafieldsIdentifier!]!) {
      shop {
        metafields(identifiers: $identifiers) {
          id
          namespace
          key
          value
          type
          reference {
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch({ 
      query, 
      variables: { identifiers } 
    });
    return data?.shop?.metafields || [];
  } catch (error) {
    console.error('Failed to fetch store metafields:', error);
    return [];
  }
}

/**
 * Get hero slider slides from Shopify Metafields
 * Expected metafield structure:
 * - namespace: "hero"
 * - keys: "slider_slides" (JSON string with array of slide objects)
 */
export async function getHeroSlides() {
  try {
    // 1) Legacy method (JSON string): hero.slider_slides
    const legacyMetafields = await getStoreMetafields('hero', ['slider_slides']);
    const legacy = legacyMetafields.find((m) => m && m.key === 'slider_slides');

    if (legacy && legacy.value) {
      try {
        const slides = JSON.parse(legacy.value);
        if (Array.isArray(slides) && slides.length) return slides;
      } catch {
        // ignore, fallback to new slot fields
      }
    }

    // 2) New user-friendly method (fixed slots):
    // hero.slider_slide_1_image, hero.slider_slide_1_link, hero.slider_slide_1_title, hero.slider_slide_1_alt
    const slotCount = 5;
    const keys = [];
    for (let i = 1; i <= slotCount; i++) {
      keys.push(`slider_slide_${i}_image`, `slider_slide_${i}_link`, `slider_slide_${i}_title`, `slider_slide_${i}_alt`);
    }

    const metafields = await getStoreMetafields('hero', keys);
    const byKey = new Map((metafields || []).map((m) => [m.key, m]));

    const extractImageUrl = (mf) => {
      if (!mf) return null;
      // Media image reference
      if (mf.reference?.image?.url) return mf.reference.image.url;
      // Fallback: sometimes URL is stored directly as value
      if (typeof mf.value === 'string' && mf.value.trim()) return mf.value;
      return null;
    };

    const getValue = (key) => {
      const mf = byKey.get(key);
      if (!mf || mf.value == null) return null;
      return typeof mf.value === 'string' ? mf.value : String(mf.value);
    };

    const slides = [];
    for (let i = 1; i <= slotCount; i++) {
      const imgMf = byKey.get(`slider_slide_${i}_image`);
      const image = extractImageUrl(imgMf);
      if (!image) continue;

      const link = getValue(`slider_slide_${i}_link`) || '#';
      const title = getValue(`slider_slide_${i}_title`) || '';
      const alt = getValue(`slider_slide_${i}_alt`) || title || `Hero slide ${i}`;

      slides.push({
        id: i,
        image,
        link,
        title,
        alt,
      });
    }

    return slides;
  } catch (error) {
    console.error('Failed to parse hero slides:', error);
    return [];
  }
}

/**
 * Get home banners from Shopify store metafields.
 * Metafield expected:
 * - namespace: "banner"
 * - keys: "double_small", "double_large"
 * - value: JSON string of an array:
 *   [{ "id": 1, "image": "https://...", "title": "Neue Liquids", "link": "/e-liquids/neu" }, ...]
 */
export async function getHomeBanners() {
  try {
    const metafields = await getStoreMetafields('banner', ['double_small', 'double_large']);

    const parse = (key) => {
      const mf = metafields.find((m) => m && m.key === key);
      if (!mf || !mf.value) return [];
      try {
        const parsed = JSON.parse(mf.value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    return {
      double_small: parse('double_small'),
      double_large: parse('double_large'),
    };
  } catch (error) {
    console.error('Failed to fetch home banners:', error);
    return { double_small: [], double_large: [] };
  }
}

/**
 * React hook for products (client-side)
 */
export function useShopifyProducts(options = {}) {
  // This is a placeholder - implement with React Query or SWR if needed
  return {
    products: [],
    loading: false,
    error: null,
  };
}

