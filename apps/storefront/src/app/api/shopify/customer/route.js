import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Get customer data from Shopify
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const shopifyStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
    const adminApiToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

    if (!adminApiToken) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://${shopifyStoreDomain}/admin/api/2024-10/customers/${customerId}.json`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminApiToken,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      customer: data.customer,
    });
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json(
      { error: error.message || 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
