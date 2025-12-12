/**
 * Bulk Import to Shopify Plus using Admin API
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../data/shopify-import');
const IMAGE_MAPPING_FILE = path.join(__dirname, '../data/image-mapping.json');

// Shopify Configuration
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'vampirevape-2.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const API_VERSION = '2024-04';

const baseURL = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}`;

// Shopify API Client
async function shopifyRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${baseURL}${endpoint}`,
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// Load image mapping
async function loadImageMapping() {
  try {
    const data = await fs.readFile(IMAGE_MAPPING_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Image mapping file not found, continuing without image mapping');
    return {};
  }
}

// Import Products
async function importProducts() {
  console.log('Importing products...');
  
  const data = await fs.readFile(path.join(INPUT_DIR, 'products.json'), 'utf8');
  const products = JSON.parse(data);
  const imageMapping = await loadImageMapping();

  let imported = 0;
  let failed = 0;

  for (const product of products) {
    try {
      // Map images using image mapping
      if (product.images && product.images.length > 0) {
        product.images = product.images.map((img) => {
          // Try to find mapped URL
          const mapped = Object.values(imageMapping).find(
            (m) => m.shopware_url === img.src
          );
          return {
            ...img,
            src: mapped ? mapped.shopify_url : img.src,
          };
        });
      }

      const response = await shopifyRequest('POST', '/products.json', { product });
      
      if (response.product) {
        imported++;
        console.log(`✓ Imported product ${imported}/${products.length}: ${product.title}`);
      } else {
        failed++;
        console.log(`✗ Failed to import: ${product.title}`);
      }

      // Rate limiting (2 requests per second)
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      failed++;
      console.error(`Error importing product ${product.title}:`, error.message);
    }
  }

  console.log(`\n✓ Imported ${imported} products`);
  console.log(`✗ Failed ${failed} products`);
}

// Import Collections
async function importCollections() {
  console.log('Importing collections...');
  
  const data = await fs.readFile(path.join(INPUT_DIR, 'collections.json'), 'utf8');
  const collections = JSON.parse(data);
  const imageMapping = await loadImageMapping();

  let imported = 0;
  let failed = 0;

  for (const collection of collections) {
    try {
      // Map collection image
      if (collection.image) {
        const mapped = Object.values(imageMapping).find(
          (m) => m.shopware_url === collection.image
        );
        if (mapped) {
          collection.image = mapped.shopify_url;
        }
      }

      const response = await shopifyRequest('POST', '/collections.json', {
        collection: {
          title: collection.title,
          body_html: collection.body_html,
          handle: collection.handle,
          image: collection.image,
        },
      });

      if (response.collection) {
        imported++;
        console.log(`✓ Imported collection ${imported}/${collections.length}: ${collection.title}`);
      } else {
        failed++;
        console.log(`✗ Failed to import: ${collection.title}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      failed++;
      console.error(`Error importing collection ${collection.title}:`, error.message);
    }
  }

  console.log(`\n✓ Imported ${imported} collections`);
  console.log(`✗ Failed ${failed} collections`);
}

// Import Customers
async function importCustomers() {
  console.log('Importing customers...');
  
  const data = await fs.readFile(path.join(INPUT_DIR, 'customers.json'), 'utf8');
  const customers = JSON.parse(data);

  let imported = 0;
  let failed = 0;

  for (const customer of customers) {
    try {
      const response = await shopifyRequest('POST', '/customers.json', { customer });

      if (response.customer) {
        imported++;
        console.log(`✓ Imported customer ${imported}/${customers.length}: ${customer.email}`);
      } else {
        failed++;
        console.log(`✗ Failed to import: ${customer.email}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      failed++;
      console.error(`Error importing customer ${customer.email}:`, error.message);
    }
  }

  console.log(`\n✓ Imported ${imported} customers`);
  console.log(`✗ Failed ${failed} customers`);
}

// Import Orders
async function importOrders() {
  console.log('Importing orders...');
  
  const data = await fs.readFile(path.join(INPUT_DIR, 'orders.json'), 'utf8');
  const orders = JSON.parse(data);

  let imported = 0;
  let failed = 0;

  for (const order of orders) {
    try {
      const response = await shopifyRequest('POST', '/orders.json', { order });

      if (response.order) {
        imported++;
        console.log(`✓ Imported order ${imported}/${orders.length}: ${order.id}`);
      } else {
        failed++;
        console.log(`✗ Failed to import order: ${order.id}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      failed++;
      console.error(`Error importing order:`, error.message);
    }
  }

  console.log(`\n✓ Imported ${imported} orders`);
  console.log(`✗ Failed ${failed} orders`);
}

// Main Import Function
async function main() {
  console.log('Starting Shopify import...\n');
  console.log(`Store: ${SHOPIFY_STORE}\n`);

  try {
    await importProducts();
    await importCollections();
    await importCustomers();
    await importOrders();

    console.log('\n✓ Import completed successfully!');
  } catch (error) {
    console.error('\n✗ Import failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  importProducts,
  importCollections,
  importCustomers,
  importOrders,
};

