import { getShopifyMenu } from '@/utils/shopify';

/**
 * API route to fetch Shopify menu (Admin API requires server-side)
 */
export async function GET() {
  try {
    const { menu } = await getShopifyMenu('main-menu');
    
    return Response.json({ menu }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch Shopify menu:', error);
    return Response.json(
      { menu: null, error: error.message },
      { status: 500 }
    );
  }
}

