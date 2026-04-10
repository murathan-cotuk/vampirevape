import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const jsonSuccess = (message, extra = {}, status = 200) =>
  NextResponse.json({ success: true, error: null, message, ...extra }, { status });

const jsonError = (message, status = 400, extra = {}) =>
  NextResponse.json({ success: false, error: message, message, ...extra }, { status });

export async function POST(request) {
  try {
    const { cartItems, customerInfo } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return jsonError('Cart is empty', 400);
    }

    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

    if (!storeDomain || !storefrontToken) {
      return jsonError('Shopify configuration missing', 500);
    }

    // Use current Shopify cart flow (cartCreate) and redirect via checkoutUrl
    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const lines = cartItems.map((item) => {
      let variantId = item.variantId;
      if (!variantId.startsWith('gid://')) {
        const idMatch = variantId.match(/\d+$/);
        if (idMatch) {
          variantId = `gid://shopify/ProductVariant/${idMatch[0]}`;
        }
      }
      return {
        merchandiseId: variantId,
        quantity: item.quantity,
      };
    });

    const variables = {
      input: {
        lines,
        buyerIdentity: {
          email: customerInfo?.email || null,
          countryCode: customerInfo?.country || 'DE',
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

    const gqlErrors = data?.errors || [];
    const userErrors = data?.data?.cartCreate?.userErrors || [];
    const firstError = gqlErrors[0]?.message || userErrors[0]?.message;
    if (!response.ok || gqlErrors.length > 0 || userErrors.length > 0) {
      console.error('Cart creation error:', { gqlErrors, userErrors });
      return jsonError(firstError || 'Failed to create checkout cart', 500);
    }

    const checkoutUrl = data?.data?.cartCreate?.cart?.checkoutUrl;
    const cartId = data?.data?.cartCreate?.cart?.id;

    if (!checkoutUrl) {
      return jsonError('Checkout URL not received', 500);
    }

    return jsonSuccess('Checkout created successfully.', { checkoutUrl, cartId });
  } catch (error) {
    console.error('Checkout API error:', error);
    return jsonError('Internal server error', 500);
  }
}

