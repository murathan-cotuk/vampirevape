/**
 * Test script to check Shopify menu API using GraphQL Admin API
 */

require('dotenv').config({ path: require('path').join(__dirname, '../apps/storefront/.env.local') });

const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
const API_VERSION = '2024-10';

async function testMenuGraphQL() {
  console.log('🧪 Testing Shopify Menu GraphQL Admin API\n');
  console.log('Store:', SHOPIFY_STORE);
  console.log('Token:', ADMIN_API_TOKEN ? `${ADMIN_API_TOKEN.substring(0, 10)}...` : 'NOT SET');
  console.log('');

  if (!ADMIN_API_TOKEN) {
    console.error('❌ SHOPIFY_ADMIN_API_TOKEN not set!');
    return;
  }

  const graphqlQuery = `
    query getNavigationMenus {
      navigationMenus(first: 50) {
        edges {
          node {
            id
            title
            handle
            items {
              id
              title
              url
              type
              items {
                id
                title
                url
                type
                items {
                  id
                  title
                  url
                  type
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': ADMIN_API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: graphqlQuery }),
      }
    );

    if (!response.ok) {
      console.error(`❌ Status: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error:', errorText.substring(0, 500));
      return;
    }

    const data = await response.json();

    if (data.errors) {
      console.error('❌ GraphQL Errors:');
      data.errors.forEach((error) => {
        console.error(`  - ${error.message}`);
        if (error.extensions) {
          console.error(`    Extensions:`, JSON.stringify(error.extensions, null, 2));
        }
      });
      return;
    }

    const navigationMenus = data.data?.navigationMenus?.edges || [];
    
    console.log(`✅ GraphQL Admin API works!`);
    console.log(`Menus found: ${navigationMenus.length}\n`);

    if (navigationMenus.length === 0) {
      console.log('⚠️  No menus found. Create a menu in Shopify: Content > Menus');
      return;
    }

    navigationMenus.forEach((edge) => {
      const menu = edge.node;
      console.log(`📋 Menu: ${menu.title}`);
      console.log(`   Handle: ${menu.handle}`);
      console.log(`   ID: ${menu.id}`);
      console.log(`   Items: ${menu.items?.length || 0}`);
      
      if (menu.items && menu.items.length > 0) {
        console.log(`   Menu Items:`);
        menu.items.forEach((item) => {
          console.log(`     - ${item.title} (${item.type}) → ${item.url}`);
          if (item.items && item.items.length > 0) {
            item.items.forEach((subItem) => {
              console.log(`       └─ ${subItem.title} (${subItem.type}) → ${subItem.url}`);
            });
          }
        });
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMenuGraphQL();

