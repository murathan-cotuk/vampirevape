/**
 * API route to fetch hero slides
 * This uses Admin API to fetch shop metafields (Storefront API doesn't support shop metafields well)
 */
export async function GET() {
  try {
    // For now, return empty array
    // TODO: Implement Admin API call to fetch hero.slider_slides metafield
    // This requires Admin API token which should be server-side only
    
    // Temporary: Check if we can use Storefront API
    const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const STOREFRONT_API_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
    
    if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_API_TOKEN) {
      return Response.json({ slides: [] }, { status: 200 });
    }

    const query = `
      query getShopMetafield {
        shop {
          metafield(namespace: "hero", key: "slider_slides") {
            id
            namespace
            key
            value
            type
          }
        }
      }
    `;

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_API_TOKEN,
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch hero slides:', response.statusText);
      return Response.json({ slides: [] }, { status: 200 });
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return Response.json({ slides: [] }, { status: 200 });
    }

    const metafield = data.data?.shop?.metafield;
    
    if (!metafield || !metafield.value) {
      return Response.json({ slides: [] }, { status: 200 });
    }

    try {
      const slides = JSON.parse(metafield.value);
      return Response.json({ slides: Array.isArray(slides) ? slides : [] }, { status: 200 });
    } catch (parseError) {
      console.error('Failed to parse hero slides:', parseError);
      return Response.json({ slides: [] }, { status: 200 });
    }
  } catch (error) {
    console.error('Failed to fetch hero slides:', error);
    return Response.json({ slides: [] }, { status: 200 });
  }
}

