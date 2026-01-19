/**
 * Shopify Shipping Rates Utilities
 * Fetch shipping rates and checkout settings from Shopify
 */

import { shopifyFetch } from './shopify';

/**
 * Get available shipping rates for a checkout
 * This requires creating a checkout first, then querying shipping rates
 */
export async function getShippingRates(checkoutId) {
  const query = `
    query getShippingRates($checkoutId: ID!) {
      node(id: $checkoutId) {
        ... on Checkout {
          availableShippingRates {
            ready
            shippingRates {
              handle
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  return await shopifyFetch({ 
    query, 
    variables: { checkoutId } 
  });
}

/**
 * Create a checkout and get shipping rates
 */
export async function createCheckoutWithShipping(cartItems, shippingAddress) {
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          availableShippingRates {
            ready
            shippingRates {
              handle
              title
              price {
                amount
                currencyCode
              }
            }
          }
          subtotalPrice {
            amount
            currencyCode
          }
          totalPrice {
            amount
            currencyCode
          }
          totalTax {
            amount
            currencyCode
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  const lineItems = cartItems.map((item) => {
    let variantId = item.variantId;
    if (!variantId.startsWith('gid://')) {
      const idMatch = variantId.match(/\d+$/);
      if (idMatch) {
        variantId = `gid://shopify/ProductVariant/${idMatch[0]}`;
      }
    }
    return {
      variantId,
      quantity: item.quantity,
    };
  });

  const variables = {
    input: {
      lineItems,
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address1: shippingAddress.address,
        city: shippingAddress.city,
        zip: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
      },
    },
  };

  return await shopifyFetch({ query: mutation, variables });
}


