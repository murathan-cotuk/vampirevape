const SHOPIFY_API_VERSION = '2024-10';

export const jsonSuccess = (message, extra = {}, status = 200) =>
  Response.json({ success: true, error: null, message, ...extra }, { status });

export const jsonError = (message, status = 400, extra = {}) =>
  Response.json({ success: false, error: message, message, ...extra }, { status });

export function getShopifyConfig() {
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
  return { storeDomain, storefrontToken };
}

export async function storefrontRequest({ query, variables = {} }) {
  const { storeDomain, storefrontToken } = getShopifyConfig();
  if (!storeDomain || !storefrontToken) {
    throw new Error('Shopify configuration missing');
  }

  const response = await fetch(`https://${storeDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  return { response, data };
}

export function normalizeVariantId(variantId) {
  if (!variantId) return variantId;
  if (variantId.startsWith('gid://')) return variantId;
  const idMatch = String(variantId).match(/\d+$/);
  return idMatch ? `gid://shopify/ProductVariant/${idMatch[0]}` : variantId;
}

