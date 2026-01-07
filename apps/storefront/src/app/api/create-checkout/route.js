import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { cartItems, customerInfo } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

    if (!storeDomain || !storefrontToken) {
      return NextResponse.json(
        { error: 'Shopify configuration missing' },
        { status: 500 }
      );
    }

    // Create a checkout using Shopify Storefront API
    const mutation = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }
    `;

    // Convert cart items to line items
    // Ensure variantId is in correct format (GID format)
    const lineItems = cartItems.map((item) => {
      let variantId = item.variantId;
      // If variantId is not in GID format, convert it
      if (!variantId.startsWith('gid://')) {
        // Extract ID from variantId if it's already a GID
        const idMatch = variantId.match(/\d+$/);
        if (idMatch) {
          variantId = `gid://shopify/ProductVariant/${idMatch[0]}`;
        }
      }
      return {
        variantId,
        quantity: item.quantity,
      };
    });

    const variables = {
      input: {
        lineItems,
        email: customerInfo.email,
        shippingAddress: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          address1: customerInfo.address,
          city: customerInfo.city,
          zip: customerInfo.postalCode,
          country: customerInfo.country,
          phone: customerInfo.phone,
        },
      },
    };

    const response = await fetch(`https://${storeDomain}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
    });

    const data = await response.json();

    if (data.errors || data.data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
      console.error('Checkout creation error:', data.errors || data.data?.checkoutCreate?.checkoutUserErrors);
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500 }
      );
    }

    const checkoutUrl = data.data?.checkoutCreate?.checkout?.webUrl;

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Checkout URL not received' },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

