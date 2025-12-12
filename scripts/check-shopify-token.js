/**
 * Check if Shopify Storefront API token is configured
 * Helps diagnose token issues
 */

require('dotenv').config({ path: require('path').join(__dirname, '../apps/storefront/.env.local') });

const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';

console.log('🔍 Shopify Storefront API Token Kontrolü\n');
console.log('='.repeat(50));

// Check if token exists
if (!STOREFRONT_TOKEN) {
  console.log('❌ Token bulunamadı!\n');
  console.log('Sorun: NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN environment variable ayarlanmamış.\n');
  console.log('Çözüm adımları:');
  console.log('1. Shopify Admin → Settings → Apps and sales channels');
  console.log('2. Develop apps → Vampire Vape Headless app\'ini seçin');
  console.log('3. Configuration → Storefront API');
  console.log('4. Distribution bölümüne gidin ve "Distribute app" yapın');
  console.log('5. Distribution tamamlandıktan sonra token görünecek');
  console.log('6. Token\'ı kopyalayın ve .env.local dosyasına ekleyin:\n');
  console.log('   NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=shpat_xxxxxxxxxxxxx\n');
  console.log('Detaylı rehber: SHOPIFY_STOREFRONT_TOKEN_TROUBLESHOOTING.md\n');
  process.exit(1);
}

// Check token format
const tokenPattern = /^shp(at|ca)_[a-zA-Z0-9]{32,}$/;
if (!tokenPattern.test(STOREFRONT_TOKEN)) {
  console.log('⚠️  Token formatı geçersiz görünüyor!\n');
  console.log(`Token: ${STOREFRONT_TOKEN.substring(0, 20)}...`);
  console.log('Token genellikle şu formatta olmalı: shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n');
}

// Check store domain
if (!STORE_DOMAIN || !STORE_DOMAIN.includes('.myshopify.com')) {
  console.log('⚠️  Store domain formatı geçersiz!\n');
  console.log(`Domain: ${STORE_DOMAIN}`);
  console.log('Domain şu formatta olmalı: store-name.myshopify.com\n');
}

console.log('✅ Token bulundu!');
console.log(`Store: ${STORE_DOMAIN}`);
console.log(`Token: ${STOREFRONT_TOKEN.substring(0, 15)}...${STOREFRONT_TOKEN.substring(STOREFRONT_TOKEN.length - 5)}\n`);

// Test connection
console.log('🧪 API bağlantısı test ediliyor...\n');

const axios = require('axios');

const query = `
  query {
    shop {
      name
      description
    }
  }
`;

axios.post(
  `https://${STORE_DOMAIN}/api/2024-10/graphql.json`,
  { query },
  {
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
  }
)
  .then((response) => {
    if (response.data.errors) {
      console.log('❌ API hatası:');
      console.log(JSON.stringify(response.data.errors, null, 2));
      console.log('\nOlası nedenler:');
      console.log('- Token geçersiz veya expire olmuş');
      console.log('- Distribution tamamlanmamış');
      console.log('- App install edilmemiş');
      console.log('- Scopes yeterli değil');
      process.exit(1);
    }

    console.log('✅ API bağlantısı başarılı!');
    console.log(`Shop: ${response.data.data.shop.name}\n`);
    console.log('🎉 Her şey hazır! Development server\'ı başlatabilirsiniz:');
    console.log('   npm run dev\n');
  })
  .catch((error) => {
    console.log('❌ API bağlantı hatası:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 401) {
        console.log('\n🔧 Çözüm:');
        console.log('- Token\'ı kontrol edin');
        console.log('- Distribution\'ın tamamlandığından emin olun');
        console.log('- App\'in install edildiğini kontrol edin');
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

