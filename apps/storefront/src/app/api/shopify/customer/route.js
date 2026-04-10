import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const mapNewsletterState = (state) => {
  if (!state) return 'UNKNOWN';
  return state.toLowerCase() === 'subscribed' ? 'SUBSCRIBED' : 'NOT_SUBSCRIBED';
};

/**
 * Get customer data from Shopify
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');
    const customerToken = searchParams.get('token');

    if (!customerId && !customerToken) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const shopifyStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
    const adminApiToken = process.env.SHOPIFY_ADMIN_API_TOKEN;
    const storefrontApiToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

    if (customerToken) {
      if (!storefrontApiToken) {
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }

      const query = `
        query getCustomer($token: String!) {
          customer(customerAccessToken: $token) {
            id
            firstName
            lastName
            email
            phone
            tags
            defaultAddress {
              id
              address1
              address2
              city
              country
              zip
              province
            }
          }
        }
      `;

      const storefrontResponse = await fetch(
        `https://${shopifyStoreDomain}/api/2024-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storefrontApiToken,
          },
          body: JSON.stringify({
            query,
            variables: { token: customerToken },
          }),
        }
      );

      const storefrontData = await storefrontResponse.json();
      const customer = storefrontData?.data?.customer;
      if (!storefrontResponse.ok || storefrontData.errors?.length || !customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }

      let newsletterStatus = 'UNKNOWN';
      if (adminApiToken && customer.email) {
        try {
          const searchQuery = `email:"${customer.email}"`;
          const adminSearchResponse = await fetch(
            `https://${shopifyStoreDomain}/admin/api/2024-10/customers/search.json?query=${encodeURIComponent(searchQuery)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminApiToken,
              },
            }
          );
          const adminSearchData = await adminSearchResponse.json();
          const adminCustomer = adminSearchData?.customers?.[0];
          newsletterStatus = mapNewsletterState(adminCustomer?.email_marketing_consent?.state);
        } catch (adminError) {
          console.warn('Could not resolve newsletter status from Admin API:', adminError.message);
        }
      }

      return NextResponse.json({
        customer: {
          id: customer.id,
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          tags: customer.tags || [],
          default_address: customer.defaultAddress
            ? {
                id: customer.defaultAddress.id,
                address1: customer.defaultAddress.address1,
                address2: customer.defaultAddress.address2,
                city: customer.defaultAddress.city,
                country: customer.defaultAddress.country,
                zip: customer.defaultAddress.zip,
                province: customer.defaultAddress.province,
              }
            : null,
          newsletter_status: newsletterStatus,
        },
      });
    }

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
      customer: {
        ...data.customer,
        newsletter_status: mapNewsletterState(data.customer?.email_marketing_consent?.state),
      },
    });
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json(
      { error: error.message || 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
