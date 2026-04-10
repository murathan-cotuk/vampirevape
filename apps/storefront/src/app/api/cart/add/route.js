import { jsonError, jsonSuccess, normalizeVariantId, storefrontRequest } from '../_shared';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { cartId, lines = [] } = await request.json();
    if (!cartId) return jsonError('cartId is required', 400);

    const normalizedLines = lines.map((line) => ({
      merchandiseId: normalizeVariantId(line.merchandiseId || line.variantId),
      quantity: Number(line.quantity || 1),
    }));

    const mutation = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product { title }
                      image { url altText }
                      price { amount currencyCode }
                    }
                  }
                }
              }
            }
          }
          userErrors { field message }
        }
      }
    `;

    const { response, data } = await storefrontRequest({
      query: mutation,
      variables: { cartId, lines: normalizedLines },
    });

    const gqlErrors = data?.errors || [];
    const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
    if (!response.ok || gqlErrors.length || userErrors.length) {
      return jsonError(gqlErrors[0]?.message || userErrors[0]?.message || 'Cart add failed', 500);
    }

    const cart = data?.data?.cartLinesAdd?.cart;
    return jsonSuccess('Cart lines added.', { cart });
  } catch (error) {
    return jsonError(error.message || 'Cart add failed', 500);
  }
}

