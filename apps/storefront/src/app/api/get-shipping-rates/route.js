import { NextResponse } from 'next/server';
import { createCheckoutWithShipping } from '@/utils/shopify-shipping';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { cartItems, shippingAddress } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    const data = await createCheckoutWithShipping(cartItems, shippingAddress);

    if (data.checkoutCreate?.checkoutUserErrors?.length > 0) {
      return NextResponse.json(
        { error: data.checkoutCreate.checkoutUserErrors[0].message },
        { status: 400 }
      );
    }

    const checkout = data.checkoutCreate?.checkout;

    if (!checkout) {
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutId: checkout.id,
      shippingRates: checkout.availableShippingRates?.shippingRates || [],
      subtotal: checkout.subtotalPrice,
      total: checkout.totalPrice,
      tax: checkout.totalTax,
    });
  } catch (error) {
    console.error('Shipping rates API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


