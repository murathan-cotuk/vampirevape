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
    throw new Error(
      'NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN is not set. ' +
      'Please check your .env.local file. ' +
      'Token might not be visible if distribution is not completed. ' +
      'See SHOPIFY_STOREFRONT_TOKEN_TROUBLESHOOTING.md for help.'
    );
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
              selectedOptions {
                name
                value
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
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
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
          }
        }
      }
    }
  `;

  return await shopifyFetch({ query, variables: { handle } });
}

/**
 * Fetch menu from Shopify Admin API
 * Note: Storefront API doesn't support menus, so we use Admin API
 * Shopify Admin API uses REST API, not GraphQL
 */
export async function getShopifyMenu(menuHandle = 'main-menu') {
  const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
  const SHOPIFY_STORE = process.env.SHOPIFY_STORE || SHOPIFY_STORE_DOMAIN;
  const ADMIN_API_VERSION = '2024-10';

  if (!ADMIN_API_TOKEN) {
    console.warn('SHOPIFY_ADMIN_API_TOKEN not set, menu will be empty');
    return { menu: null };
  }

  try {
    // Shopify Admin API: Get all menus
    // Note: Shopify Admin API uses REST, endpoint might be different
    // Try: /admin/api/{version}/menus.json or check Shopify docs
    
    // Alternative: Use Online Store Navigation API
    // GET /admin/api/{version}/online_store/navigation_menus.json
    const menusResponse = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${ADMIN_API_VERSION}/online_store/navigation_menus.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ADMIN_API_TOKEN,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!menusResponse.ok) {
      // If navigation_menus doesn't work, try menus endpoint
      const fallbackResponse = await fetch(
        `https://${SHOPIFY_STORE}/admin/api/${ADMIN_API_VERSION}/menus.json`,
        {
          headers: {
            'X-Shopify-Access-Token': ADMIN_API_TOKEN,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!fallbackResponse.ok) {
        throw new Error(`Admin API error: ${fallbackResponse.statusText}`);
      }

      const menusData = await fallbackResponse.json();
      const menu = menusData.menus?.find((m) => m.handle === menuHandle) || menusData.menus?.[0];

      if (!menu) {
        return { menu: null };
      }

      // Get menu items
      const menuItemsResponse = await fetch(
        `https://${SHOPIFY_STORE}/admin/api/${ADMIN_API_VERSION}/menus/${menu.id}/menu_items.json`,
        {
          headers: {
            'X-Shopify-Access-Token': ADMIN_API_TOKEN,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!menuItemsResponse.ok) {
        return { menu: null };
      }

      const menuItemsData = await menuItemsResponse.json();
      
      // Recursively fetch nested items
      const processMenuItems = (items) => {
        return items.map((item) => ({
          id: item.id,
          title: item.title,
          url: item.url,
          type: item.type,
          items: item.items ? processMenuItems(item.items) : [],
        }));
      };

      return {
        menu: {
          id: menu.id,
          title: menu.title,
          handle: menu.handle,
          items: processMenuItems(menuItemsData.menu_items || []),
        },
      };
    }

    // Navigation menus API response
    const menusData = await menusResponse.json();
    const navigationMenus = menusData.navigation_menus || [];
    
    // Find menu by handle or use first menu
    const menu = navigationMenus.find((m) => m.handle === menuHandle) || navigationMenus[0];

    if (!menu) {
      return { menu: null };
    }

    // Get menu items (navigation menu items are nested in the response)
    return {
      menu: {
        id: menu.id,
        title: menu.title,
        handle: menu.handle,
        items: (menu.items || []).map((item) => ({
          id: item.id,
          title: item.title,
          url: item.url,
          type: item.type,
          items: item.items ? item.items.map((subItem) => ({
            id: subItem.id,
            title: subItem.title,
            url: subItem.url,
            type: subItem.type,
          })) : [],
        })),
      },
    };
  } catch (error) {
    console.error('Failed to fetch Shopify menu:', error);
    return { menu: null };
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

