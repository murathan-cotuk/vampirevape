/**
 * Shopify Admin Token & Permission Checker
 * 
 * Bu script Shopify Admin API token'ının doğru scope'lara sahip olup olmadığını kontrol eder.
 * 
 * Kullanım:
 * node apps/storefront/scripts/check-shopify-token.js
 */

const shopifyStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
const adminApiToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

if (!adminApiToken) {
  console.error('❌ SHOPIFY_ADMIN_API_TOKEN environment variable not set!');
  process.exit(1);
}

async function checkTokenPermissions() {
  console.log('🔍 Checking Shopify Admin API Token...\n');
  console.log('Store Domain:', shopifyStoreDomain);
  console.log('Token (first 10 chars):', adminApiToken.substring(0, 10) + '...\n');

  try {
    // Test 1: Basic API access
    console.log('Test 1: Basic API Access...');
    const shopResponse = await fetch(
      `https://${shopifyStoreDomain}/admin/api/2024-10/shop.json`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminApiToken,
        },
      }
    );

    if (!shopResponse.ok) {
      console.error('❌ Basic API access failed!');
      console.error('Status:', shopResponse.status);
      const errorData = await shopResponse.json();
      console.error('Error:', errorData);
      return;
    }

    const shopData = await shopResponse.json();
    console.log('✅ Basic API access successful');
    console.log('Shop Name:', shopData.shop?.name);
    console.log('Shop Email:', shopData.shop?.email, '\n');

    // Test 2: Customer read permission
    console.log('Test 2: Customer Read Permission...');
    const customersResponse = await fetch(
      `https://${shopifyStoreDomain}/admin/api/2024-10/customers.json?limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminApiToken,
        },
      }
    );

    if (!customersResponse.ok) {
      console.error('❌ Customer read permission missing!');
      console.error('Status:', customersResponse.status);
      const errorData = await customersResponse.json();
      console.error('Error:', errorData);
      console.log('\n💡 Fix: Add "read_customers" scope to your Custom App');
    } else {
      console.log('✅ Customer read permission OK');
    }

    // Test 3: Customer write permission (via GraphQL)
    console.log('\nTest 3: Customer Write Permission (GraphQL)...');
    const testMutation = `
      mutation {
        customerEmailMarketingConsentUpdate(input: {
          customerId: "gid://shopify/Customer/1"
          emailMarketingConsent: {
            marketingState: SUBSCRIBED
            marketingOptInLevel: SINGLE_OPT_IN
          }
        }) {
          userErrors {
            field
            message
          }
        }
      }
    `;

    const graphqlResponse = await fetch(
      `https://${shopifyStoreDomain}/admin/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminApiToken,
        },
        body: JSON.stringify({ query: testMutation }),
      }
    );

    const graphqlData = await graphqlResponse.json();

    if (graphqlData.errors) {
      console.error('❌ GraphQL access failed!');
      console.error('Errors:', graphqlData.errors);
      console.log('\n💡 Fix: Check token permissions and API version');
    } else if (graphqlData.data?.customerEmailMarketingConsentUpdate?.userErrors?.length > 0) {
      const userErrors = graphqlData.data.customerEmailMarketingConsentUpdate.userErrors;
      const hasPermissionError = userErrors.some(err => 
        err.message?.toLowerCase().includes('permission') ||
        err.message?.toLowerCase().includes('access')
      );

      if (hasPermissionError) {
        console.error('❌ Customer write permission missing!');
        console.error('User Errors:', userErrors);
        console.log('\n💡 Fix: Add "write_customers" scope to your Custom App');
      } else {
        console.log('✅ GraphQL mutation accessible');
        console.log('Note: User errors are expected (test customer ID), but mutation is accessible');
      }
    } else {
      console.log('✅ GraphQL mutation accessible');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 SUMMARY');
    console.log('='.repeat(50));
    console.log('✅ Token is valid');
    console.log('✅ Basic API access: OK');
    console.log('✅ Customer read: OK (if no error above)');
    console.log('✅ Customer write: OK (if no error above)');
    console.log('\n💡 If you see permission errors above:');
    console.log('   1. Go to Shopify Admin > Settings > Apps and sales channels');
    console.log('   2. Select your Custom App');
    console.log('   3. Go to API credentials');
    console.log('   4. Ensure "read_customers" and "write_customers" scopes are enabled');
    console.log('   5. Save and regenerate token if needed');

  } catch (error) {
    console.error('❌ Error checking token:', error.message);
    process.exit(1);
  }
}

checkTokenPermissions();
