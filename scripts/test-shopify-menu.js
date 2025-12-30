/**
 * Test script to check Shopify menu API
 */

require('dotenv').config({ path: require('path').join(__dirname, '../apps/storefront/.env.local') });

const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
const API_VERSION = '2024-10';

async function testMenuAPI() {
  console.log('🧪 Testing Shopify Menu API\n');
  console.log('Store:', SHOPIFY_STORE);
  console.log('Token:', ADMIN_API_TOKEN ? `${ADMIN_API_TOKEN.substring(0, 10)}...` : 'NOT SET');
  console.log('');

  if (!ADMIN_API_TOKEN) {
    console.error('❌ SHOPIFY_ADMIN_API_TOKEN not set!');
    return;
  }

  // Test 1: Navigation Menus API
  console.log('📋 Test 1: Navigation Menus API');
  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/online_store/navigation_menus.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ADMIN_API_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Navigation Menus API works!');
      console.log('Menus found:', data.navigation_menus?.length || 0);
      if (data.navigation_menus && data.navigation_menus.length > 0) {
        data.navigation_menus.forEach((menu) => {
          console.log(`  - ${menu.title} (handle: ${menu.handle}, id: ${menu.id})`);
        });
      }
    } else {
      console.log(`❌ Status: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log('Error:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('');

  // Test 2: Legacy Menus API
  console.log('📋 Test 2: Legacy Menus API');
  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/menus.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ADMIN_API_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Legacy Menus API works!');
      console.log('Menus found:', data.menus?.length || 0);
      if (data.menus && data.menus.length > 0) {
        data.menus.forEach((menu) => {
          console.log(`  - ${menu.title} (handle: ${menu.handle}, id: ${menu.id})`);
        });
      }
    } else {
      console.log(`❌ Status: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log('Error:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMenuAPI();

