/**
 * URL Mapper for hierarchical category URLs
 * Converts menu structure to SEO-friendly URLs: /parent/child
 */

/**
 * Build hierarchical URL path from menu structure
 * @param {Object} menuItem - Menu item from Shopify
 * @param {Array} menuItems - All menu items to find parent
 * @param {Object} menu - Full menu object for context
 * @returns {string} - SEO-friendly URL path (e.g., "/parent/child")
 */
export function buildCategoryUrl(menuItem, allMenuItems = [], menu = null) {
  if (!menuItem || !menuItem.url) return null;

  // Extract handle from Shopify collection URL
  // Format: /collections/handle or https://store.myshopify.com/collections/handle
  const url = menuItem.url;
  let handle = null;

  if (url.includes('/collections/')) {
    const match = url.match(/\/collections\/([^\/\?]+)/);
    if (match) {
      handle = match[1];
    }
  }

  if (!handle) return null;

  // Use provided menu items or menu.items
  const itemsToSearch = allMenuItems.length > 0 ? allMenuItems : (menu?.items || []);
  
  // Find parent in menu structure
  const parent = findParentMenuItem(menuItem, itemsToSearch);
  
  if (parent && parent.url && parent.url.includes('/collections/')) {
    const parentMatch = parent.url.match(/\/collections\/([^\/\?]+)/);
    if (parentMatch) {
      const parentHandle = parentMatch[1];
      return `/${parentHandle}/${handle}`;
    }
  }

  // No parent, return just the handle
  return `/${handle}`;
}

/**
 * Find parent menu item for a given menu item
 * @param {Object} menuItem - Menu item to find parent for
 * @param {Array} menuItems - All menu items to search
 * @returns {Object|null} - Parent menu item or null
 */
function findParentMenuItem(menuItem, menuItems) {
  if (!menuItems || menuItems.length === 0) return null;

  // Recursively search for parent
  for (const item of menuItems) {
    // Check if this item's children contain our menuItem
    if (item.items && item.items.length > 0) {
      // Check direct children
      if (item.items.some(child => child.id === menuItem.id || child.url === menuItem.url)) {
        return item;
      }
      
      // Recursively check nested children
      const found = findParentMenuItem(menuItem, item.items);
      if (found) {
        return item; // Return the parent of the found item
      }
    }
  }

  return null;
}

/**
 * Extract collection handle from hierarchical URL
 * @param {string} urlPath - URL path like "/parent/child" or "/child"
 * @returns {string} - Collection handle (last segment)
 */
export function extractHandleFromUrl(urlPath) {
  if (!urlPath) return null;
  
  // Remove leading/trailing slashes and get last segment
  const segments = urlPath.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : null;
}

/**
 * Build URL mapping from menu structure
 * Maps hierarchical URLs to collection handles
 * @param {Object} menu - Menu object from Shopify
 * @returns {Map} - Map of URL paths to collection handles
 */
export function buildUrlMapping(menu) {
  const urlMap = new Map();
  
  if (!menu || !menu.items) return urlMap;

  const processMenuItem = (item, allItems) => {
    if (!item.url || !item.url.includes('/collections/')) return;

    const url = buildCategoryUrl(item, allItems, menu);
    if (url) {
      const handle = extractHandleFromUrl(url);
      if (handle) {
        urlMap.set(url, handle);
        // Also map the handle directly for backwards compatibility
        urlMap.set(`/${handle}`, handle);
      }
    }

    // Process children recursively
    if (item.items && item.items.length > 0) {
      item.items.forEach(child => processMenuItem(child, allItems));
    }
  };

  menu.items.forEach(item => processMenuItem(item, menu.items));

  return urlMap;
}

/**
 * Get collection handle from URL path using menu mapping
 * @param {string} urlPath - URL path like "/parent/child"
 * @param {Map} urlMapping - URL mapping from buildUrlMapping
 * @returns {string|null} - Collection handle or null
 */
export function getHandleFromUrl(urlPath, urlMapping) {
  if (!urlPath || !urlMapping) return null;

  // Try exact match first
  if (urlMapping.has(urlPath)) {
    return urlMapping.get(urlPath);
  }

  // Fallback: extract last segment (for backwards compatibility)
  return extractHandleFromUrl(urlPath);
}

