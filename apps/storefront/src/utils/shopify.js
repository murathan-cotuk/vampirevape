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
 * Fetch menu from Shopify Admin API using GraphQL
 * Note: Storefront API doesn't support menus, so we use Admin API GraphQL
 * Content > Menus altından oluşturulan menüleri çeker
 */
export async function getShopifyMenu(menuHandle = 'main-menu-1') {
  const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
  const SHOPIFY_STORE = process.env.SHOPIFY_STORE || SHOPIFY_STORE_DOMAIN;
  const ADMIN_API_VERSION = '2024-10';

  if (!ADMIN_API_TOKEN) {
    console.warn('SHOPIFY_ADMIN_API_TOKEN not set, menu will be empty');
    return { menu: null };
  }

  try {
    // Use GraphQL Admin API to fetch navigation menus
    const graphqlQuery = `
      query getNavigationMenus {
        navigationMenus(first: 50) {
          edges {
            node {
              id
              title
              handle
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
        }
      }
    `;

    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': ADMIN_API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: graphqlQuery }),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`GraphQL Admin API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const navigationMenus = data.data?.navigationMenus?.edges || [];
    
    // Find menu by handle (try main-menu-1, main-menu, or use first menu)
    let menu = navigationMenus.find(
      (edge) => edge.node.handle === menuHandle
    )?.node;

    if (!menu && menuHandle === 'main-menu-1') {
      // Fallback to main-menu
      menu = navigationMenus.find(
        (edge) => edge.node.handle === 'main-menu'
      )?.node;
    }

    if (!menu && navigationMenus.length > 0) {
      // Use first menu as fallback
      menu = navigationMenus[0].node;
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
        items: processMenuItems(item.items),
      }));
    };

    return {
      menu: {
        id: menu.id,
        title: menu.title,
        handle: menu.handle,
        items: processMenuItems(menu.items || []),
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

