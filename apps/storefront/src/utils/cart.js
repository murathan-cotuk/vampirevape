/**
 * Shopping Cart Utilities
 * Client-side cart management
 */

const CART_STORAGE_KEY = 'vampirevape_cart';

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

export function addToCart(variantId, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.variantId === variantId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ variantId, quantity });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(variantId) {
  const cart = getCart().filter((item) => item.variantId !== variantId);
  saveCart(cart);
  return cart;
}

export function updateCartItem(variantId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item.variantId === variantId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(variantId);
    }
    item.quantity = quantity;
  }

  saveCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
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

