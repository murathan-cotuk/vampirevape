import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      );
    }

    const shopifyStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
    const storefrontApiToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
    const adminApiToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

    if (!storefrontApiToken) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error', message: 'Storefront token is missing.' },
        { status: 500 }
      );
    }

    const mutation = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const response = await fetch(
      `https://${shopifyStoreDomain}/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontApiToken,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: { email, password },
          },
        }),
      }
    );

    const data = await response.json();
    const result = data?.data?.customerAccessTokenCreate;
    const customerToken = result?.customerAccessToken;
    const customerUserErrors = result?.customerUserErrors || [];
    const firstError = customerUserErrors[0];

    if (!response.ok || data.errors?.length || firstError || !customerToken?.accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || 'Ungültige E-Mail-Adresse oder Passwort.',
          message: 'Anmeldung fehlgeschlagen.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      accessToken: customerToken.accessToken,
      expiresAt: customerToken.expiresAt,
      ...(adminApiToken
        ? await (async () => {
            try {
              const searchResponse = await fetch(
                `https://${shopifyStoreDomain}/admin/api/2024-10/customers/search.json?query=${encodeURIComponent(`email:\"${email}\"`)}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': adminApiToken,
                  },
                }
              );
              const searchData = await searchResponse.json();
              const found = searchData?.customers?.[0];
              return found ? { customerId: String(found.id) } : {};
            } catch {
              return {};
            }
          })()
        : {}),
      message: 'Anmeldung erfolgreich.',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Ein Fehler ist aufgetreten.',
        message: 'Anmeldung fehlgeschlagen.',
      },
      { status: 500 }
    );
  }
}
