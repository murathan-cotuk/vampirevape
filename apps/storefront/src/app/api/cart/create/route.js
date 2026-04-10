import { jsonError, jsonSuccess, normalizeVariantId, storefrontRequest } from '../_shared';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { lines = [] } = await request.json();
    const normalizedLines = lines.map((line) => ({
      merchandiseId: normalizeVariantId(line.merchandiseId || line.variantId),
      quantity: Number(line.quantity || 1),
    }));

    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
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
      variables: { input: { lines: normalizedLines } },
    });

    const gqlErrors = data?.errors || [];
    const userErrors = data?.data?.cartCreate?.userErrors || [];
    if (!response.ok || gqlErrors.length || userErrors.length) {
      return jsonError(gqlErrors[0]?.message || userErrors[0]?.message || 'Cart create failed', 500);
    }

    const cart = data?.data?.cartCreate?.cart;
    return jsonSuccess('Cart created.', { cart });
  } catch (error) {
    return jsonError(error.message || 'Cart create failed', 500);
  }
}

