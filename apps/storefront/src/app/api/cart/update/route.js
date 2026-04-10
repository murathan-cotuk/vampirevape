import { jsonError, jsonSuccess, storefrontRequest } from '../_shared';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { cartId, lines = [] } = await request.json();
    if (!cartId) return jsonError('cartId is required', 400);

    const normalizedLines = lines.map((line) => ({
      id: line.id,
      quantity: Number(line.quantity || 1),
    }));

    const mutation = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
    const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
    if (!response.ok || gqlErrors.length || userErrors.length) {
      return jsonError(gqlErrors[0]?.message || userErrors[0]?.message || 'Cart update failed', 500);
    }

    const cart = data?.data?.cartLinesUpdate?.cart;
    return jsonSuccess('Cart lines updated.', { cart });
  } catch (error) {
    return jsonError(error.message || 'Cart update failed', 500);
  }
}

