/**
 * API Route to test Shopify connection
 * GET /api/test-shopify
 */

import { shopifyFetch } from '@/utils/shopify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `
      query {
        shop {
          name
          description
        }
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `;

    const data = await shopifyFetch({ query });

    return Response.json({
      success: true,
      shop: data.shop,
      productsCount: data.products.edges.length,
      message: 'Shopify API connection successful!',
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
        message: 'Shopify API connection failed. Please check your credentials.',
      },
      { status: 500 }
    );
  }
}

