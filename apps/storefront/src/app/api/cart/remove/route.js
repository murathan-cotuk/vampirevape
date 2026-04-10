import { jsonError, jsonSuccess, storefrontRequest } from '../_shared';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { cartId, lineIds = [] } = await request.json();
    if (!cartId) return jsonError('cartId is required', 400);
    if (!lineIds.length) return jsonError('lineIds are required', 400);

    const mutation = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
      variables: { cartId, lineIds },
    });

    const gqlErrors = data?.errors || [];
    const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
    if (!response.ok || gqlErrors.length || userErrors.length) {
      return jsonError(gqlErrors[0]?.message || userErrors[0]?.message || 'Cart remove failed', 500);
    }

    const cart = data?.data?.cartLinesRemove?.cart;
    return jsonSuccess('Cart lines removed.', { cart });
  } catch (error) {
    return jsonError(error.message || 'Cart remove failed', 500);
  }
}

