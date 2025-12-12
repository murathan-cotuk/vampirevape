/**
 * Upload Images to Cloudinary/Shopify CDN
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');

const INPUT_DIR = path.join(__dirname, '../data/shopware-export');
const OUTPUT_DIR = path.join(__dirname, '../data/image-mapping.json');

// Configuration
const UPLOAD_METHOD = process.env.UPLOAD_METHOD || 'shopify'; // 'shopify' or 'cloudinary'
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'vampirevape-2.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const imageMapping = {};

// Upload to Shopify
async function uploadToShopify(imageUrl, productId = null) {
  try {
    const response = await axios.post(
      `https://${SHOPIFY_STORE}/admin/api/2024-04/files.json`,
      {
        file: {
          url: imageUrl,
        },
      },
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.file.url;
  } catch (error) {
    console.error(`Error uploading to Shopify: ${error.message}`);
    return null;
  }
}

// Upload to Cloudinary
async function uploadToCloudinary(imageUrl) {
  try {
    const formData = new FormData();
    formData.append('file', imageUrl);
    formData.append('upload_preset', 'vampirevape');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error(`Error uploading to Cloudinary: ${error.message}`);
    return null;
  }
}

// Download image from Shopware
async function downloadImage(shopwareUrl) {
  try {
    const response = await axios.get(shopwareUrl, {
      responseType: 'stream',
    });
    return response.data;
  } catch (error) {
    console.error(`Error downloading image: ${error.message}`);
    return null;
  }
}

// Process media files
async function processMedia() {
  console.log('Processing media files...');
  
  const data = await fs.readFile(path.join(INPUT_DIR, 'media.json'), 'utf8');
  const mediaFiles = JSON.parse(data);

  let processed = 0;
  let failed = 0;

  for (const media of mediaFiles) {
    if (!media.url) continue;

    const shopwareUrl = media.url.startsWith('http')
      ? media.url
      : `https://your-shopware-instance.com${media.url}`;

    try {
      let uploadedUrl;

      if (UPLOAD_METHOD === 'shopify') {
        uploadedUrl = await uploadToShopify(shopwareUrl);
      } else {
        uploadedUrl = await uploadToCloudinary(shopwareUrl);
      }

      if (uploadedUrl) {
        imageMapping[media.id] = {
          shopware_url: shopwareUrl,
          shopify_url: uploadedUrl,
          cloudinary_url: uploadedUrl,
        };
        processed++;
        console.log(`✓ Uploaded ${processed}/${mediaFiles.length}: ${media.id}`);
      } else {
        failed++;
        console.log(`✗ Failed to upload: ${media.id}`);
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      failed++;
      console.error(`Error processing media ${media.id}:`, error.message);
    }
  }

  // Save mapping
  await fs.writeFile(OUTPUT_DIR, JSON.stringify(imageMapping, null, 2));
  
  console.log(`\n✓ Processed ${processed} images`);
  console.log(`✗ Failed ${failed} images`);
  console.log(`Mapping saved to: ${OUTPUT_DIR}`);
}

// Process product images
async function processProductImages() {
  console.log('Processing product images...');
  
  const data = await fs.readFile(path.join(INPUT_DIR, 'products.json'), 'utf8');
  const products = JSON.parse(data);
  const mappingData = await fs.readFile(OUTPUT_DIR, 'utf8').catch(() => '{}');
  const existingMapping = JSON.parse(mappingData);

  let processed = 0;

  for (const product of products) {
    if (!product.media || product.media.length === 0) continue;

    for (const media of product.media) {
      if (existingMapping[media.id]) continue;

      const shopwareUrl = media.url.startsWith('http')
        ? media.url
        : `https://your-shopware-instance.com${media.url}`;

      try {
        let uploadedUrl;

        if (UPLOAD_METHOD === 'shopify') {
          uploadedUrl = await uploadToShopify(shopwareUrl, product.id);
        } else {
          uploadedUrl = await uploadToCloudinary(shopwareUrl);
        }

        if (uploadedUrl) {
          existingMapping[media.id] = {
            shopware_url: shopwareUrl,
            shopify_url: uploadedUrl,
            cloudinary_url: uploadedUrl,
            product_id: product.id,
          };
          processed++;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing product image:`, error.message);
      }
    }
  }

  await fs.writeFile(OUTPUT_DIR, JSON.stringify(existingMapping, null, 2));
  console.log(`✓ Processed ${processed} product images`);
}

async function main() {
  console.log('Starting image upload...\n');
  console.log(`Upload method: ${UPLOAD_METHOD}\n`);

  try {
    await processMedia();
    await processProductImages();

    console.log('\n✓ Image upload completed!');
  } catch (error) {
    console.error('\n✗ Image upload failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  uploadToShopify,
  uploadToCloudinary,
  processMedia,
  processProductImages,
};

