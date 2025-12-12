/**
 * Transform Shopware6 Data to Shopify Format
 */

const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../data/shopware-export');
const OUTPUT_DIR = path.join(__dirname, '../data/shopify-import');

async function ensureOutputDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating output directory:', error);
  }
}

// Transform Product
function transformProduct(shopwareProduct) {
  const shopifyProduct = {
    title: shopwareProduct.name || shopwareProduct.translated?.name || 'Unnamed Product',
    body_html: shopwareProduct.description || shopwareProduct.translated?.description || '',
    vendor: shopwareProduct.manufacturer?.name || 'Vampire Vape',
    product_type: shopwareProduct.categories?.[0]?.name || 'General',
    tags: [
      ...(shopwareProduct.categories?.map(cat => cat.name) || []),
      ...(shopwareProduct.properties?.map(prop => prop.name) || []),
    ].join(', '),
    variants: [],
    images: [],
    metafields: [],
  };

  // Transform variants
  if (shopwareProduct.options && shopwareProduct.options.length > 0) {
    shopwareProduct.options.forEach((option) => {
      const variant = {
        title: option.name || 'Default',
        price: (shopwareProduct.price?.[0]?.gross || 0).toString(),
        sku: shopwareProduct.productNumber || '',
        inventory_quantity: shopwareProduct.stock || 0,
        weight: shopwareProduct.weight || 0,
        weight_unit: 'kg',
        requires_shipping: true,
        option1: option.name || null,
        option2: null,
        option3: null,
      };
      shopifyProduct.variants.push(variant);
    });
  } else {
    // Single variant product
    shopifyProduct.variants.push({
      title: 'Default',
      price: (shopwareProduct.price?.[0]?.gross || 0).toString(),
      sku: shopwareProduct.productNumber || '',
      inventory_quantity: shopwareProduct.stock || 0,
      weight: shopwareProduct.weight || 0,
      weight_unit: 'kg',
      requires_shipping: true,
    });
  }

  // Transform images
  if (shopwareProduct.media && shopwareProduct.media.length > 0) {
    shopwareProduct.media.forEach((media) => {
      if (media.url) {
        shopifyProduct.images.push({
          src: media.url.startsWith('http') 
            ? media.url 
            : `https://your-shopware-instance.com${media.url}`,
          alt: media.alt || shopifyProduct.title,
        });
      }
    });
  }

  // Add metafields
  shopifyProduct.metafields.push(
    {
      key: 'shopware_id',
      value: shopwareProduct.id,
      type: 'single_line_text_field',
      namespace: 'migration',
    },
    {
      key: 'ean',
      value: shopwareProduct.ean || '',
      type: 'single_line_text_field',
      namespace: 'product',
    }
  );

  return shopifyProduct;
}

// Transform Category to Collection
function transformCategory(shopwareCategory) {
  const shopifyCollection = {
    title: shopwareCategory.name || shopwareCategory.translated?.name || 'Unnamed Collection',
    body_html: shopwareCategory.description || shopwareCategory.translated?.description || '',
    handle: (shopwareCategory.name || 'collection')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    image: shopwareCategory.media?.[0]?.url 
      ? (shopwareCategory.media[0].url.startsWith('http')
          ? shopwareCategory.media[0].url
          : `https://your-shopware-instance.com${shopwareCategory.media[0].url}`)
      : null,
    metafields: [
      {
        key: 'shopware_id',
        value: shopwareCategory.id,
        type: 'single_line_text_field',
        namespace: 'migration',
      },
    ],
  };

  return shopifyCollection;
}

// Transform Customer
function transformCustomer(shopwareCustomer) {
  const shopifyCustomer = {
    first_name: shopwareCustomer.firstName || '',
    last_name: shopwareCustomer.lastName || '',
    email: shopwareCustomer.email || '',
    phone: shopwareCustomer.defaultBillingAddress?.phone || '',
    verified_email: shopwareCustomer.active || false,
    addresses: [],
    metafields: [
      {
        key: 'shopware_id',
        value: shopwareCustomer.id,
        type: 'single_line_text_field',
        namespace: 'migration',
      },
    ],
  };

  // Transform addresses
  if (shopwareCustomer.addresses && shopwareCustomer.addresses.length > 0) {
    shopwareCustomer.addresses.forEach((address) => {
      shopifyCustomer.addresses.push({
        first_name: address.firstName || '',
        last_name: address.lastName || '',
        company: address.company || '',
        address1: address.street || '',
        address2: address.additionalAddressLine1 || '',
        city: address.city || '',
        province: address.state?.name || '',
        country: address.country?.iso || 'DE',
        zip: address.zipcode || '',
        phone: address.phoneNumber || '',
        default: address.id === shopwareCustomer.defaultBillingAddressId,
      });
    });
  }

  return shopifyCustomer;
}

// Transform Order
function transformOrder(shopwareOrder) {
  const shopifyOrder = {
    email: shopwareOrder.orderCustomer?.email || '',
    financial_status: mapOrderStatus(shopwareOrder.stateMachineState?.technicalName),
    fulfillment_status: mapFulfillmentStatus(shopwareOrder.deliveries?.[0]?.stateMachineState?.technicalName),
    line_items: [],
    shipping_address: {},
    billing_address: {},
    total_price: (shopwareOrder.amountTotal || 0).toString(),
    currency: shopwareOrder.currency?.isoCode || 'EUR',
    metafields: [
      {
        key: 'shopware_id',
        value: shopwareOrder.id,
        type: 'single_line_text_field',
        namespace: 'migration',
      },
    ],
  };

  // Transform line items
  if (shopwareOrder.lineItems) {
    shopwareOrder.lineItems.forEach((item) => {
      shopifyOrder.line_items.push({
        title: item.label || '',
        quantity: item.quantity || 1,
        price: (item.unitPrice || 0).toString(),
        sku: item.payload?.productNumber || '',
      });
    });
  }

  // Transform addresses
  if (shopwareOrder.addresses) {
    const billingAddress = shopwareOrder.addresses.find(
      (addr) => addr.id === shopwareOrder.billingAddressId
    );
    const shippingAddress = shopwareOrder.addresses.find(
      (addr) => addr.id === shopwareOrder.deliveries?.[0]?.shippingOrderAddressId
    );

    if (billingAddress) {
      shopifyOrder.billing_address = {
        first_name: billingAddress.firstName || '',
        last_name: billingAddress.lastName || '',
        company: billingAddress.company || '',
        address1: billingAddress.street || '',
        city: billingAddress.city || '',
        province: billingAddress.state?.name || '',
        country: billingAddress.country?.iso || 'DE',
        zip: billingAddress.zipcode || '',
        phone: billingAddress.phoneNumber || '',
      };
    }

    if (shippingAddress) {
      shopifyOrder.shipping_address = {
        first_name: shippingAddress.firstName || '',
        last_name: shippingAddress.lastName || '',
        company: shippingAddress.company || '',
        address1: shippingAddress.street || '',
        city: shippingAddress.city || '',
        province: shippingAddress.state?.name || '',
        country: shippingAddress.country?.iso || 'DE',
        zip: shippingAddress.zipcode || '',
        phone: shippingAddress.phoneNumber || '',
      };
    }
  }

  return shopifyOrder;
}

// Helper: Map Shopware order status to Shopify
function mapOrderStatus(shopwareStatus) {
  const statusMap = {
    'order.state.open': 'pending',
    'order.state.in_progress': 'pending',
    'order.state.completed': 'paid',
    'order.state.cancelled': 'voided',
    'order.state.refunded': 'refunded',
  };
  return statusMap[shopwareStatus] || 'pending';
}

// Helper: Map Shopware fulfillment status to Shopify
function mapFulfillmentStatus(shopwareStatus) {
  const statusMap = {
    'order_delivery.state.open': 'unfulfilled',
    'order_delivery.state.shipped': 'fulfilled',
    'order_delivery.state.returned': 'restocked',
  };
  return statusMap[shopwareStatus] || 'unfulfilled';
}

// Main Transform Function
async function transformProducts() {
  console.log('Transforming products...');
  const data = await fs.readFile(path.join(INPUT_DIR, 'products.json'), 'utf8');
  const shopwareProducts = JSON.parse(data);
  const shopifyProducts = shopwareProducts.map(transformProduct);

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'products.json'),
    JSON.stringify(shopifyProducts, null, 2)
  );
  console.log(`✓ Transformed ${shopifyProducts.length} products`);
}

async function transformCategories() {
  console.log('Transforming categories...');
  const data = await fs.readFile(path.join(INPUT_DIR, 'categories.json'), 'utf8');
  const shopwareCategories = JSON.parse(data);
  const shopifyCollections = shopwareCategories.map(transformCategory);

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'collections.json'),
    JSON.stringify(shopifyCollections, null, 2)
  );
  console.log(`✓ Transformed ${shopifyCollections.length} categories`);
}

async function transformCustomers() {
  console.log('Transforming customers...');
  const data = await fs.readFile(path.join(INPUT_DIR, 'customers.json'), 'utf8');
  const shopwareCustomers = JSON.parse(data);
  const shopifyCustomers = shopwareCustomers.map(transformCustomer);

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'customers.json'),
    JSON.stringify(shopifyCustomers, null, 2)
  );
  console.log(`✓ Transformed ${shopifyCustomers.length} customers`);
}

async function transformOrders() {
  console.log('Transforming orders...');
  const data = await fs.readFile(path.join(INPUT_DIR, 'orders.json'), 'utf8');
  const shopwareOrders = JSON.parse(data);
  const shopifyOrders = shopwareOrders.map(transformOrder);

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'orders.json'),
    JSON.stringify(shopifyOrders, null, 2)
  );
  console.log(`✓ Transformed ${shopifyOrders.length} orders`);
}

async function main() {
  console.log('Starting transformation...\n');
  await ensureOutputDir();

  try {
    await transformProducts();
    await transformCategories();
    await transformCustomers();
    await transformOrders();

    console.log('\n✓ Transformation completed successfully!');
    console.log(`Transformed data saved to: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('\n✗ Transformation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  transformProduct,
  transformCategory,
  transformCustomer,
  transformOrder,
};

