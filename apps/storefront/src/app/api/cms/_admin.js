const API_VERSION = '2024-10';

function getConfig() {
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN;
  return { shop, token };
}

export async function adminGraphql(query, variables = {}) {
  const { shop, token } = getConfig();
  if (!token) {
    throw new Error('SHOPIFY_ADMIN_API_TOKEN is not configured');
  }

  const res = await fetch(`https://${shop}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors) {
    throw new Error(JSON.stringify(json.errors || json || { status: res.status }));
  }
  return json.data;
}

export function parseMetaobjectFields(fields = []) {
  const map = new Map();
  for (const f of fields) {
    map.set(f.key, f.value || '');
  }
  return map;
}

