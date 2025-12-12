/**
 * Test Shopify API Connection
 */

require('dotenv').config({ path: require('path').join(__dirname, '../apps/storefront/.env.local') });

const axios = require('axios');

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

async function testStorefrontAPI() {
  console.log('🧪 Testing Storefront API...\n');

  if (!SHOPIFY_STORE || !STOREFRONT_TOKEN) {
    console.error('❌ Storefront API credentials missing!');
    console.log('Please set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN\n');
    return false;
  }

  try {
    const query = `
      query {
        shop {
          name
          description
        }
        products(first: 1) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `;

    const response = await axios.post(
      `https://${SHOPIFY_STORE}/api/2024-04/graphql.json`,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
        },
      }
    );

    if (response.data.errors) {
      console.error('❌ Storefront API Error:', response.data.errors);
      return false;
    }

    console.log('✅ Storefront API: Connected');
    console.log(`   Shop: ${response.data.data.shop.name}`);
    console.log(`   Products found: ${response.data.data.products.edges.length}\n`);
    return true;
  } catch (error) {
    console.error('❌ Storefront API Error:', error.response?.data || error.message);
    return false;
  }
}

async function testAdminAPI() {
  console.log('🧪 Testing Admin API...\n');

  if (!SHOPIFY_STORE || !ADMIN_TOKEN) {
    console.error('❌ Admin API credentials missing!');
    console.log('Please set SHOPIFY_ADMIN_API_TOKEN\n');
    return false;
  }

  try {
    const response = await axios.get(
      `https://${SHOPIFY_STORE}/admin/api/2024-04/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Admin API: Connected');
    console.log(`   Shop: ${response.data.shop.name}`);
    console.log(`   Domain: ${response.data.shop.domain}\n`);
    return true;
  } catch (error) {
    console.error('❌ Admin API Error:', error.response?.data || error.message);
    return false;
  }
}

async function main() {
  console.log('🔗 Testing Shopify API Connections\n');
  console.log(`Store: ${SHOPIFY_STORE || 'Not set'}\n`);

  const storefrontOk = await testStorefrontAPI();
  const adminOk = await testAdminAPI();

  if (storefrontOk && adminOk) {
    console.log('✅ All API connections successful!');
    process.exit(0);
  } else {
    console.log('❌ Some API connections failed. Please check your credentials.');
    process.exit(1);
  }
}

main();

