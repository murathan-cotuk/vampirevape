/**
 * Test Migration Scripts Connection
 */

require('dotenv').config();

const SHOPWARE_URL = process.env.SHOPWARE_URL;
const SHOPWARE_ACCESS_KEY = process.env.SHOPWARE_ACCESS_KEY;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'vampirevape-2.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

async function testShopware() {
  console.log('🧪 Testing Shopware6 Connection...\n');

  if (!SHOPWARE_URL || !SHOPWARE_ACCESS_KEY) {
    console.log('⚠️  Shopware6 credentials not set (optional for migration)');
    return false;
  }

  try {
    const axios = require('axios');
    const response = await axios.get(`${SHOPWARE_URL}/api/product`, {
      headers: {
        'Authorization': `Bearer ${SHOPWARE_ACCESS_KEY}`,
      },
      params: { limit: 1 },
    });

    console.log('✅ Shopware6: Connected');
    console.log(`   Products available: ${response.data.total || 'N/A'}\n`);
    return true;
  } catch (error) {
    console.error('❌ Shopware6 Error:', error.message);
    return false;
  }
}

async function testShopify() {
  console.log('🧪 Testing Shopify Admin API...\n');

  if (!SHOPIFY_STORE || !SHOPIFY_ADMIN_API_TOKEN) {
    console.error('❌ Shopify credentials missing!');
    console.log('Please set SHOPIFY_STORE and SHOPIFY_ADMIN_API_TOKEN\n');
    return false;
  }

  try {
    const axios = require('axios');
    const response = await axios.get(
      `https://${SHOPIFY_STORE}/admin/api/2024-04/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
        },
      }
    );

    console.log('✅ Shopify Admin API: Connected');
    console.log(`   Shop: ${response.data.shop.name}\n`);
    return true;
  } catch (error) {
    console.error('❌ Shopify Error:', error.response?.data || error.message);
    return false;
  }
}

async function main() {
  console.log('🔗 Testing Migration Connections\n');

  const shopwareOk = await testShopware();
  const shopifyOk = await testShopify();

  if (shopifyOk) {
    console.log('✅ Ready for migration!');
    if (!shopwareOk) {
      console.log('⚠️  Note: Shopware6 connection not configured (optional)');
    }
    process.exit(0);
  } else {
    console.log('❌ Migration setup incomplete. Please configure credentials.');
    process.exit(1);
  }
}

main();

