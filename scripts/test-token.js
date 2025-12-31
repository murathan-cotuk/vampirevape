/**
 * Test a specific Storefront API token
 */

const axios = require('axios');

const TOKEN = process.argv[2] || process.env.SHOPIFY_API_KEY || 'your-api-key';
const STORE_DOMAIN = 'vampirevape-2.myshopify.com';

console.log('🧪 Testing Storefront API Token\n');
console.log('='.repeat(50));
console.log(`Token: ${TOKEN.substring(0, 10)}...${TOKEN.substring(TOKEN.length - 5)}`);
console.log(`Store: ${STORE_DOMAIN}\n`);

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

axios.post(
  `https://${STORE_DOMAIN}/api/2024-10/graphql.json`,
  { query },
  {
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
  }
)
  .then((response) => {
    if (response.data.errors) {
      console.log('❌ API hatası:');
      console.log(JSON.stringify(response.data.errors, null, 2));
      console.log('\nOlası nedenler:');
      console.log('- Token geçersiz veya expire olmuş');
      console.log('- Token formatı yanlış');
      console.log('- Distribution tamamlanmamış');
      console.log('- Scopes yeterli değil');
      process.exit(1);
    }

    console.log('✅ Token geçerli! API bağlantısı başarılı!\n');
    console.log(`Shop: ${response.data.data.shop.name}`);
    console.log(`Products found: ${response.data.data.products.edges.length}\n`);
    console.log('🎉 Token çalışıyor! .env.local dosyasına ekleyebilirsiniz:\n');
    console.log(`NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=${TOKEN}\n`);
  })
  .catch((error) => {
    console.log('❌ API bağlantı hatası:\n');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 401) {
        console.log('\n🔧 Çözüm:');
        console.log('- Token geçersiz veya yanlış');
        console.log('- Token formatını kontrol edin');
        console.log('- Distribution\'ın tamamlandığından emin olun');
      } else if (error.response.status === 403) {
        console.log('\n🔧 Çözüm:');
        console.log('- Gerekli scopes\'ların seçildiğinden emin olun');
        console.log('- unauthenticated_read_product_listings scope\'u seçili olmalı');
      }
    } else {
      console.log(`Error: ${error.message}`);
    }
    process.exit(1);
  });

