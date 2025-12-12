/**
 * Shopware6 Export Script
 * Exports all data from Shopware6 to JSON files
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Shopware6 API Configuration
const SHOPWARE_URL = process.env.SHOPWARE_URL || 'https://your-shopware6-instance.com';
const SHOPWARE_ACCESS_KEY = process.env.SHOPWARE_ACCESS_KEY;
const SHOPWARE_SECRET_KEY = process.env.SHOPWARE_SECRET_KEY;

const OUTPUT_DIR = path.join(__dirname, '../data/shopware-export');

// Create output directory
async function ensureOutputDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating output directory:', error);
  }
}

// Shopware API Client
async function shopwareRequest(endpoint, params = {}) {
  try {
    const response = await axios.get(`${SHOPWARE_URL}/api/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${SHOPWARE_ACCESS_KEY}`,
        'Content-Type': 'application/json',
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw error;
  }
}

// Export Products
async function exportProducts() {
  console.log('Exporting products...');
  const products = [];
  let page = 1;
  const limit = 100;

  while (true) {
    try {
      const data = await shopwareRequest('product', {
        page,
        limit,
        associations: {
          categories: {},
          media: {},
          properties: {},
          options: {},
          configuratorSettings: {},
        },
      });

      if (!data.data || data.data.length === 0) break;

      products.push(...data.data);
      console.log(`Exported ${products.length} products...`);

      if (data.data.length < limit) break;
      page++;
    } catch (error) {
      console.error('Error exporting products:', error);
      break;
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'products.json'),
    JSON.stringify(products, null, 2)
  );
  console.log(`✓ Exported ${products.length} products`);
  return products;
}

// Export Categories
async function exportCategories() {
  console.log('Exporting categories...');
  const categories = [];
  let page = 1;
  const limit = 100;

  while (true) {
    try {
      const data = await shopwareRequest('category', {
        page,
        limit,
        associations: {
          media: {},
          cmsPage: {},
        },
      });

      if (!data.data || data.data.length === 0) break;

      categories.push(...data.data);
      console.log(`Exported ${categories.length} categories...`);

      if (data.data.length < limit) break;
      page++;
    } catch (error) {
      console.error('Error exporting categories:', error);
      break;
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2)
  );
  console.log(`✓ Exported ${categories.length} categories`);
  return categories;
}

// Export Customers
async function exportCustomers() {
  console.log('Exporting customers...');
  const customers = [];
  let page = 1;
  const limit = 100;

  while (true) {
    try {
      const data = await shopwareRequest('customer', {
        page,
        limit,
        associations: {
          addresses: {},
          group: {},
        },
      });

      if (!data.data || data.data.length === 0) break;

      customers.push(...data.data);
      console.log(`Exported ${customers.length} customers...`);

      if (data.data.length < limit) break;
      page++;
    } catch (error) {
      console.error('Error exporting customers:', error);
      break;
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'customers.json'),
    JSON.stringify(customers, null, 2)
  );
  console.log(`✓ Exported ${customers.length} customers`);
  return customers;
}

// Export Orders
async function exportOrders() {
  console.log('Exporting orders...');
  const orders = [];
  let page = 1;
  const limit = 100;

  while (true) {
    try {
      const data = await shopwareRequest('order', {
        page,
        limit,
        associations: {
          lineItems: {},
          addresses: {},
          deliveries: {},
          transactions: {},
        },
      });

      if (!data.data || data.data.length === 0) break;

      orders.push(...data.data);
      console.log(`Exported ${orders.length} orders...`);

      if (data.data.length < limit) break;
      page++;
    } catch (error) {
      console.error('Error exporting orders:', error);
      break;
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'orders.json'),
    JSON.stringify(orders, null, 2)
  );
  console.log(`✓ Exported ${orders.length} orders`);
  return orders;
}

// Export Media
async function exportMedia() {
  console.log('Exporting media...');
  const media = [];
  let page = 1;
  const limit = 100;

  while (true) {
    try {
      const data = await shopwareRequest('media', {
        page,
        limit,
      });

      if (!data.data || data.data.length === 0) break;

      media.push(...data.data);
      console.log(`Exported ${media.length} media files...`);

      if (data.data.length < limit) break;
      page++;
    } catch (error) {
      console.error('Error exporting media:', error);
      break;
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'media.json'),
    JSON.stringify(media, null, 2)
  );
  console.log(`✓ Exported ${media.length} media files`);
  return media;
}

// Export CMS Pages (Blog, Lexikon, Static Pages)
async function exportCmsPages() {
  console.log('Exporting CMS pages...');
  const pages = [];
  let page = 1;
  const limit = 100;

  while (true) {
    try {
      const data = await shopwareRequest('cms-page', {
        page,
        limit,
      });

      if (!data.data || data.data.length === 0) break;

      pages.push(...data.data);
      console.log(`Exported ${pages.length} CMS pages...`);

      if (data.data.length < limit) break;
      page++;
    } catch (error) {
      console.error('Error exporting CMS pages:', error);
      break;
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'cms-pages.json'),
    JSON.stringify(pages, null, 2)
  );
  console.log(`✓ Exported ${pages.length} CMS pages`);
  return pages;
}

// Export Promotions/Campaigns
async function exportPromotions() {
  console.log('Exporting promotions...');
  const promotions = [];
  let page = 1;
  const limit = 100;

  while (true) {
    try {
      const data = await shopwareRequest('promotion', {
        page,
        limit,
      });

      if (!data.data || data.data.length === 0) break;

      promotions.push(...data.data);
      console.log(`Exported ${promotions.length} promotions...`);

      if (data.data.length < limit) break;
      page++;
    } catch (error) {
      console.error('Error exporting promotions:', error);
      break;
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'promotions.json'),
    JSON.stringify(promotions, null, 2)
  );
  console.log(`✓ Exported ${promotions.length} promotions`);
  return promotions;
}

// Export Newsletter Subscribers
async function exportNewsletterSubscribers() {
  console.log('Exporting newsletter subscribers...');
  const subscribers = [];
  let page = 1;
  const limit = 100;

  while (true) {
    try {
      const data = await shopwareRequest('newsletter-recipient', {
        page,
        limit,
      });

      if (!data.data || data.data.length === 0) break;

      subscribers.push(...data.data);
      console.log(`Exported ${subscribers.length} subscribers...`);

      if (data.data.length < limit) break;
      page++;
    } catch (error) {
      console.error('Error exporting newsletter subscribers:', error);
      break;
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'newsletter-subscribers.json'),
    JSON.stringify(subscribers, null, 2)
  );
  console.log(`✓ Exported ${subscribers.length} newsletter subscribers`);
  return subscribers;
}

// Main Export Function
async function main() {
  console.log('Starting Shopware6 export...\n');
  
  await ensureOutputDir();

  try {
    await exportProducts();
    await exportCategories();
    await exportCustomers();
    await exportOrders();
    await exportMedia();
    await exportCmsPages();
    await exportPromotions();
    await exportNewsletterSubscribers();

    console.log('\n✓ Export completed successfully!');
    console.log(`Data exported to: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('\n✗ Export failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  exportProducts,
  exportCategories,
  exportCustomers,
  exportOrders,
  exportMedia,
  exportCmsPages,
  exportPromotions,
  exportNewsletterSubscribers,
};

