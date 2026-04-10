import { jsonError, jsonSuccess, storefrontRequest } from '../_shared';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { cartId } = await request.json();
    if (!cartId) return jsonError('cartId is required', 400);

    const query = `
      query cartGet($cartId: ID!) {
        cart(id: $cartId) {
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
      }
    `;

    const { response, data } = await storefrontRequest({
      query,
      variables: { cartId },
    });

    if (!response.ok || data?.errors?.length) {
      return jsonError(data?.errors?.[0]?.message || 'Cart fetch failed', 500);
    }

    const cart = data?.data?.cart;
    if (!cart) return jsonError('Cart not found', 404);
    return jsonSuccess('Cart fetched.', { cart });
  } catch (error) {
    return jsonError(error.message || 'Cart fetch failed', 500);
  }
}

