/**
 * Shopify API Client using @shopify/shopify-api package
 * Alternative implementation for better token management
 */

// Uncomment if you want to use @shopify/shopify-api package
// import '@shopify/shopify-api/adapters/node';
// import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

// For now, we'll use the simple fetch-based approach
// If you want to use the official package, install it:
// npm install @shopify/shopify-api

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
const STOREFRONT_API_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
const API_VERSION = '2024-10';

const storefrontApiUrl = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

/**
 * Execute GraphQL query to Shopify Storefront API
 * This is the same function from shopify.js but kept here for reference
 */
export async function shopifyFetch({ query, variables = {} }) {
  if (!STOREFRONT_API_TOKEN) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN is not set. Please check your .env.local file.');
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
 * Test Storefront API connection
 */
export async function testStorefrontConnection() {
  const query = `
    query {
      shop {
        name
        description
      }
    }
  `;

  try {
    const data = await shopifyFetch({ query });
    return {
      success: true,
      shop: data.shop,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export for use in other files
export { shopifyFetch as default };

