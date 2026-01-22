import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Unsubscribe from newsletter - sets Shopify accepts_marketing: false and Mailchimp unsubscribe
 */
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich.' },
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

    // Find customer in Shopify
    // Use email:"..." format for more reliable search results
    const searchQuery = `email:"${email}"`;
    const searchResponse = await fetch(
      `https://${shopifyStoreDomain}/admin/api/2024-10/customers/search.json?query=${encodeURIComponent(searchQuery)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminApiToken,
        },
      }
    );

    const searchData = await searchResponse.json();
    let customerId = null;

    if (searchData.customers && searchData.customers.length > 0) {
      customerId = searchData.customers[0].id;
      console.log('Customer found, updating accepts_marketing to false:', customerId);

      // Update using customerEmailMarketingConsentUpdate mutation
      const now = new Date().toISOString();
      
      const consentMutation = `
        mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
          customerEmailMarketingConsentUpdate(input: $input) {
            emailMarketingConsent {
              marketingState
              marketingOptInLevel
              consentUpdatedAt
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const consentVariables = {
        input: {
          customerId: `gid://shopify/Customer/${customerId}`,
          emailMarketingConsent: {
            marketingState: "NOT_SUBSCRIBED",
            marketingOptInLevel: "UNKNOWN",
            consentUpdatedAt: now,
          },
        },
      };

      const consentResponse = await fetch(
        `https://${shopifyStoreDomain}/admin/api/2024-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': adminApiToken,
          },
          body: JSON.stringify({
            query: consentMutation,
            variables: consentVariables,
          }),
        }
      );

      const consentData = await consentResponse.json();
      
      // Proper error checking
      const gqlUserErrors = consentData?.data?.customerEmailMarketingConsentUpdate?.userErrors || [];
      const hasErrors = !consentResponse.ok || consentData.errors?.length || gqlUserErrors.length;
      
      if (hasErrors) {
        console.error('Consent update failed', {
          status: consentResponse.status,
          errors: consentData.errors,
          userErrors: gqlUserErrors,
        });
        
        // Fallback to REST API with email_marketing_consent
        // Note: REST uses lowercase strings ("not_subscribed"), not GraphQL enums
        const updateResponse = await fetch(
          `https://${shopifyStoreDomain}/admin/api/2024-10/customers/${customerId}.json`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': adminApiToken,
            },
            body: JSON.stringify({
              customer: {
                id: customerId,
                email_marketing_consent: {
                  state: "not_subscribed",
                  opt_in_level: "unknown",
                  consent_updated_at: now,
                },
              },
            }),
          }
        );
        
        if (!updateResponse.ok) {
          const fallbackData = await updateResponse.json();
          console.error('REST API fallback also failed:', fallbackData);
        } else {
          console.log('Email marketing consent updated via REST API fallback');
        }
      } else {
        const consent = consentData.data?.customerEmailMarketingConsentUpdate?.emailMarketingConsent;
        console.log('✅ Consent updated successfully', {
          marketingState: consent?.marketingState,
          marketingOptInLevel: consent?.marketingOptInLevel,
          consentUpdatedAt: consent?.consentUpdatedAt,
        });
      }
    }

    // Mailchimp will automatically sync from Shopify via Mailchimp app
    // No direct API calls needed - Shopify is the source of truth

    return NextResponse.json({
      success: true,
      message: 'Erfolgreich vom Newsletter abgemeldet!',
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: error.message || 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for email unsubscribe links
 * Usage: /api/newsletter/unsubscribe?email=user@example.com
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      // Redirect to newsletter page with error
      const baseUrl = new URL(request.url).origin;
      return NextResponse.redirect(new URL('/newsletteranmeldung?error=email_required', baseUrl));
    }

    // Create a POST request to call the POST handler
    const baseUrl = new URL(request.url).origin;
    const postUrl = `${baseUrl}/api/newsletter/unsubscribe`;
    
    const postRequest = new Request(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const response = await POST(postRequest);
    const responseData = await response.json();

    // If successful, redirect to a confirmation page
    if (response.ok) {
      return NextResponse.redirect(new URL('/newsletteranmeldung?unsubscribed=true', baseUrl));
    }

    // If error, redirect with error message
    const errorMsg = encodeURIComponent(responseData.error || 'unsubscribe_failed');
    return NextResponse.redirect(new URL(`/newsletteranmeldung?error=${errorMsg}`, baseUrl));
  } catch (error) {
    console.error('Newsletter unsubscribe GET error:', error);
    const baseUrl = new URL(request.url).origin;
    const errorMsg = encodeURIComponent(error.message || 'Ein Fehler ist aufgetreten.');
    return NextResponse.redirect(new URL(`/newsletteranmeldung?error=${errorMsg}`, baseUrl));
  }
}
