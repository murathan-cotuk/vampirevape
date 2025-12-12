/**
 * Generate 301 Redirect CSV for Shopify
 * Maps old Shopware6 URLs to new Shopify URLs
 */

const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../data/shopware-export');
const OUTPUT_FILE = path.join(__dirname, '../data/shopify-redirects.csv');

// Shopware URL patterns
const SHOPWARE_BASE_URL = process.env.SHOPWARE_BASE_URL || 'https://www.vampirevape.de';
const SHOPIFY_BASE_URL = process.env.SHOPIFY_BASE_URL || 'https://www.vampirevape.de';

// Generate product redirects
async function generateProductRedirects() {
  console.log('Generating product redirects...');
  
  const data = await fs.readFile(path.join(INPUT_DIR, 'products.json'), 'utf8');
  const products = JSON.parse(data);
  
  const redirects = [];

  products.forEach((product) => {
    // Shopware6 product URL pattern: /detail/index/sArticle/{id}
    const oldUrl = `${SHOPWARE_BASE_URL}/detail/index/sArticle/${product.id}`;
    
    // Shopify product URL pattern: /products/{handle}
    const handle = (product.name || product.translated?.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const newUrl = `${SHOPIFY_BASE_URL}/produkte/${handle}`;

    redirects.push({
      old: oldUrl,
      new: newUrl,
      type: 'product',
    });
  });

  console.log(`✓ Generated ${redirects.length} product redirects`);
  return redirects;
}

// Generate category redirects
async function generateCategoryRedirects() {
  console.log('Generating category redirects...');
  
  const data = await fs.readFile(path.join(INPUT_DIR, 'categories.json'), 'utf8');
  const categories = JSON.parse(data);
  
  const redirects = [];

  categories.forEach((category) => {
    // Shopware6 category URL pattern: /{category-path}
    const oldPath = category.path || category.name || '';
    const oldUrl = `${SHOPWARE_BASE_URL}/${oldPath}`;
    
    // Shopify collection URL pattern: /collections/{handle}
    const handle = (category.name || category.translated?.name || 'collection')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const newUrl = `${SHOPIFY_BASE_URL}/kategorien/${handle}`;

    redirects.push({
      old: oldUrl,
      new: newUrl,
      type: 'category',
    });
  });

  console.log(`✓ Generated ${redirects.length} category redirects`);
  return redirects;
}

// Generate CMS page redirects (Blog, Lexikon, Static Pages)
async function generateCmsRedirects() {
  console.log('Generating CMS redirects...');
  
  const data = await fs.readFile(path.join(INPUT_DIR, 'cms-pages.json'), 'utf8').catch(() => '[]');
  const pages = JSON.parse(data);
  
  const redirects = [];

  pages.forEach((page) => {
    // Shopware6 CMS URL pattern: /{page-path}
    const oldPath = page.path || page.name || '';
    const oldUrl = `${SHOPWARE_BASE_URL}/${oldPath}`;
    
    // Determine new URL based on page type
    let newUrl;
    if (page.type === 'blog') {
      const handle = (page.name || 'blog-post')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      newUrl = `${SHOPIFY_BASE_URL}/blog/${handle}`;
    } else if (page.type === 'lexikon') {
      const handle = (page.name || 'lexikon-entry')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      newUrl = `${SHOPIFY_BASE_URL}/lexikon/${handle}`;
    } else {
      const handle = (page.name || 'page')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      newUrl = `${SHOPIFY_BASE_URL}/${handle}`;
    }

    redirects.push({
      old: oldUrl,
      new: newUrl,
      type: page.type || 'cms',
    });
  });

  console.log(`✓ Generated ${redirects.length} CMS redirects`);
  return redirects;
}

// Write CSV file
async function writeRedirectsCSV(redirects) {
  console.log('Writing redirects CSV...');
  
  // CSV Header for Shopify
  let csv = 'old,new\n';
  
  redirects.forEach((redirect) => {
    // Escape commas and quotes
    const old = redirect.old.replace(/"/g, '""');
    const newUrl = redirect.new.replace(/"/g, '""');
    csv += `"${old}","${newUrl}"\n`;
  });

  await fs.writeFile(OUTPUT_FILE, csv, 'utf8');
  console.log(`✓ Wrote ${redirects.length} redirects to ${OUTPUT_FILE}`);
}

// Generate Shopify redirects JSON (alternative format)
async function writeRedirectsJSON(redirects) {
  console.log('Writing redirects JSON...');
  
  const shopifyRedirects = redirects.map((redirect) => ({
    path: redirect.old.replace(SHOPWARE_BASE_URL, ''),
    target: redirect.new.replace(SHOPIFY_BASE_URL, ''),
  }));

  const outputFile = OUTPUT_FILE.replace('.csv', '.json');
  await fs.writeFile(outputFile, JSON.stringify(shopifyRedirects, null, 2), 'utf8');
  console.log(`✓ Wrote ${shopifyRedirects.length} redirects to ${outputFile}`);
}

// Main Function
async function main() {
  console.log('Starting redirect generation...\n');

  try {
    const productRedirects = await generateProductRedirects();
    const categoryRedirects = await generateCategoryRedirects();
    const cmsRedirects = await generateCmsRedirects();

    const allRedirects = [
      ...productRedirects,
      ...categoryRedirects,
      ...cmsRedirects,
    ];

    await writeRedirectsCSV(allRedirects);
    await writeRedirectsJSON(allRedirects);

    console.log(`\n✓ Generated ${allRedirects.length} total redirects`);
    console.log(`\nNext steps:`);
    console.log(`1. Import CSV to Shopify: Settings > Navigation > URL Redirects`);
    console.log(`2. Or use Shopify Admin API to bulk import redirects`);
  } catch (error) {
    console.error('\n✗ Redirect generation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateProductRedirects,
  generateCategoryRedirects,
  generateCmsRedirects,
};

