import { getShopifyMenu } from '@/utils/shopify';

/**
 * API route to fetch Shopify menu from Storefront API
 * Content > Menus altından oluşturulan menüleri çeker
 * 
 * Force dynamic rendering to avoid static generation errors
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Get menu handle from query param or use default
    const { searchParams } = new URL(request.url);
    const menuHandle = searchParams.get('handle') || 'main-menu-1'; // Default to main-menu-1
    
    const { menu } = await getShopifyMenu(menuHandle);
    
    return Response.json({ menu }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch Shopify menu:', error);
    return Response.json(
      { menu: null, error: error.message },
      { status: 500 }
    );
  }
}

