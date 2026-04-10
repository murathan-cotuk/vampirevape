/**
 * Shopping Cart Utilities
 * Client-side cart + Shopify cart synchronization
 */

const CART_STORAGE_KEY = 'vampirevape_cart';
const CART_ID_STORAGE_KEY = 'vampirevape_cart_id';
const CHECKOUT_URL_STORAGE_KEY = 'vampirevape_cart_checkout_url';

function getCartId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_STORAGE_KEY);
}

function setCartId(cartId) {
  if (typeof window === 'undefined') return;
  if (cartId) localStorage.setItem(CART_ID_STORAGE_KEY, cartId);
}

function setCheckoutUrl(url) {
  if (typeof window === 'undefined') return;
  if (url) localStorage.setItem(CHECKOUT_URL_STORAGE_KEY, url);
}

export function getCheckoutUrl() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CHECKOUT_URL_STORAGE_KEY);
}

export function getCart() {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
}

export function addToCart(variantId, quantity = 1, productData = {}) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.variantId === variantId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      variantId,
      quantity,
      title: productData.title || '',
      variantTitle: productData.variantTitle || '',
      image: productData.image || '',
      price: productData.price || { amount: '0.00', currencyCode: 'EUR' },
    });
  }

  saveCart(cart);
  void syncCartAdd(variantId, quantity, productData);
  return cart;
}

export function removeFromCart(variantId) {
  const cart = getCart();
  const item = cart.find((it) => it.variantId === variantId);
  const next = cart.filter((it) => it.variantId !== variantId);
  if (item?.lineId) {
    void syncCartRemove(item.lineId);
  }
  saveCart(next);
  return next;
}

export function updateCartItem(variantId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item.variantId === variantId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(variantId);
    }
    item.quantity = quantity;
    if (item.lineId) {
      void syncCartUpdate(item.lineId, quantity);
    }
  }

  saveCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(CART_ID_STORAGE_KEY);
  localStorage.removeItem(CHECKOUT_URL_STORAGE_KEY);
}

export function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal() {
  const cart = getCart();
  // For now, return 0.00€ as placeholder
  // TODO: Calculate actual total from cart items with prices
  return cart.reduce((total, item) => {
    // item.price should be in format { amount: "10.00", currencyCode: "EUR" }
    const price = parseFloat(item.price?.amount || 0);
    return total + (price * item.quantity);
  }, 0);
}

function saveCart(cart) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

function mapCartFromShopify(cart) {
  const lines = cart?.lines?.edges || [];
  return lines.map(({ node }) => {
    const variant = node?.merchandise;
    return {
      lineId: node?.id,
      variantId: variant?.id,
      quantity: node?.quantity || 1,
      title: variant?.product?.title || '',
      variantTitle: variant?.title || '',
      image: variant?.image?.url || '',
      price: variant?.price || { amount: '0.00', currencyCode: 'EUR' },
    };
  });
}

async function postCart(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || `Cart API failed: ${path}`);
  }
  return data;
}

async function syncCartAdd(variantId, quantity, productData) {
  try {
    let cartId = getCartId();
    const line = { variantId, quantity };
    let data;
    if (!cartId) {
      data = await postCart('/api/cart/create', { lines: [line] });
    } else {
      data = await postCart('/api/cart/add', { cartId, lines: [line] });
    }
    const cart = data?.cart;
    if (cart?.id) setCartId(cart.id);
    if (cart?.checkoutUrl) setCheckoutUrl(cart.checkoutUrl);
    if (cart) {
      saveCart(mapCartFromShopify(cart).map((item) => ({
        ...item,
        title: item.title || productData.title || '',
      })));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  } catch (error) {
    console.error('Cart add sync failed:', error);
  }
}

async function syncCartUpdate(lineId, quantity) {
  try {
    const cartId = getCartId();
    if (!cartId) return;
    const data = await postCart('/api/cart/update', {
      cartId,
      lines: [{ id: lineId, quantity }],
    });
    const cart = data?.cart;
    if (cart?.checkoutUrl) setCheckoutUrl(cart.checkoutUrl);
    if (cart) {
      saveCart(mapCartFromShopify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  } catch (error) {
    console.error('Cart update sync failed:', error);
  }
}

async function syncCartRemove(lineId) {
  try {
    const cartId = getCartId();
    if (!cartId) return;
    const data = await postCart('/api/cart/remove', { cartId, lineIds: [lineId] });
    const cart = data?.cart;
    if (cart?.checkoutUrl) setCheckoutUrl(cart.checkoutUrl);
    if (cart) {
      saveCart(mapCartFromShopify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  } catch (error) {
    console.error('Cart remove sync failed:', error);
  }
}

