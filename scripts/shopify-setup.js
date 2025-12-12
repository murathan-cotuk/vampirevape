/**
 * Shopify API Setup Script
 * Helps configure Shopify API connections
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setupShopify() {
  console.log('🧛 Vampire Vape - Shopify API Setup\n');
  console.log('Bu script Shopify API bağlantılarını yapılandırmanıza yardımcı olur.\n');

  // Store domain
  const storeDomain = await question('Shopify Store Domain (örn: vampirevape-2.myshopify.com): ');
  
  // Storefront API Token
  console.log('\n📝 Storefront API Token:');
  console.log('1. Shopify Admin → Settings → Apps and sales channels');
  console.log('2. Develop apps → Create an app');
  console.log('3. Configuration → Storefront API');
  console.log('4. Scopes seçin:');
  console.log('   - unauthenticated_read_product_listings (products & collections için)');
  console.log('   - unauthenticated_read_product_inventory');
  console.log('   - unauthenticated_read_checkouts');
  console.log('   - unauthenticated_write_checkouts');
  console.log('   - unauthenticated_write_customers');
  console.log('   - unauthenticated_read_customers');
  console.log('5. ⚠️  ÖNEMLİ: Distribution bölümüne gidin:');
  console.log('   - "Enable distribution" veya "Distribute app" butonuna tıklayın');
  console.log('   - Distribution type: Unlisted (development için) veya Public seçin');
  console.log('   - App URL: https://vampirevapeheadless.com veya http://localhost:3000');
  console.log('   - Allowed redirection URLs: https://vampirevapeheadless.com/*');
  console.log('   - Save/Distribute butonuna tıklayın');
  console.log('6. Distribution tamamlandıktan sonra Storefront API access token görünecek');
  console.log('7. "Reveal token" butonuna tıklayıp token\'ı kopyalayın\n');
  const storefrontToken = await question('Storefront API Token: ');

  // Admin API Token
  console.log('\n📝 Admin API Token:');
  console.log('1. Aynı app\'te Configuration → Admin API');
  console.log('2. Scopes seçin:');
  console.log('   - read_products, write_products');
  console.log('   - read_customers, write_customers');
  console.log('   - read_orders, write_orders');
  console.log('   - read_files, write_files');
  console.log('   Not: read_collections ve read_redirects scope\'ları artık mevcut değil');
  console.log('3. "Reveal token" butonuna tıklayıp Admin API access token\'ı kopyalayın\n');
  const adminToken = await question('Admin API Token: ');

  // Site URL
  const siteUrl = await question('Site URL (örn: https://www.vampirevape.de): ') || 'https://www.vampirevape.de';

  // Strapi URL
  const strapiUrl = await question('Strapi URL (default: http://localhost:1337): ') || 'http://localhost:1337';

  // Create .env.local file
  const envContent = `# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=${storeDomain}
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=${storefrontToken}
SHOPIFY_ADMIN_API_TOKEN=${adminToken}
SHOPIFY_STORE=${storeDomain}

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL=${strapiUrl}

# Site Configuration
NEXT_PUBLIC_SITE_URL=${siteUrl}

# Migration (Shopware6 - Optional)
SHOPWARE_URL=
SHOPWARE_ACCESS_KEY=
SHOPWARE_SECRET_KEY=

# Image Upload
UPLOAD_METHOD=shopify
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
`;

  // Write .env.local for storefront
  const storefrontEnvPath = path.join(__dirname, '../apps/storefront/.env.local');
  await fs.writeFile(storefrontEnvPath, envContent);
  console.log(`\n✓ Created ${storefrontEnvPath}`);

  // Write .env for migration scripts
  const migrationEnvPath = path.join(__dirname, 'migrate-shopware/.env');
  await fs.writeFile(migrationEnvPath, envContent);
  console.log(`✓ Created ${migrationEnvPath}`);

  console.log('\n✅ Shopify API yapılandırması tamamlandı!');
  console.log('\nSonraki adımlar:');
  console.log('1. API token\'larını test etmek için: npm run test-shopify');
  console.log('2. Development server başlatmak için: npm run dev');
  console.log('3. Migration için: cd scripts/migrate-shopware && npm run migrate\n');

  rl.close();
}

setupShopify().catch(console.error);

