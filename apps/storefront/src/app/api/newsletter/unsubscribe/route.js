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

    if (!searchData.customers || searchData.customers.length === 0) {
      console.log('Customer not found for email:', email);
      return NextResponse.json(
        { error: 'Kunde mit dieser E-Mail-Adresse wurde nicht gefunden.' },
        { status: 404 }
      );
    }

    customerId = searchData.customers[0].id;
    console.log('Customer found, updating email marketing consent to NOT_SUBSCRIBED:', customerId);

    // Get current customer consent to ensure consentUpdatedAt is not going backwards
    // This prevents Shopify from silently rejecting the update
    let currentConsentUpdatedAt = null;
    try {
      const customerQuery = `
        query getCustomer($id: ID!) {
          customer(id: $id) {
            id
            email
            emailMarketingConsent {
              marketingState
              marketingOptInLevel
              consentUpdatedAt
            }
          }
        }
      `;

      const customerQueryResponse = await fetch(
        `https://${shopifyStoreDomain}/admin/api/2024-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': adminApiToken,
          },
          body: JSON.stringify({
            query: customerQuery,
            variables: { id: `gid://shopify/Customer/${customerId}` },
          }),
        }
      );

      const customerQueryData = await customerQueryResponse.json();
      if (customerQueryData.data?.customer?.emailMarketingConsent?.consentUpdatedAt) {
        currentConsentUpdatedAt = customerQueryData.data.customer.emailMarketingConsent.consentUpdatedAt;
        console.log('Current consentUpdatedAt:', currentConsentUpdatedAt);
      }
    } catch (queryError) {
      console.warn('Could not fetch current consent, proceeding with new timestamp:', queryError.message);
    }

    // Ensure consentUpdatedAt is not going backwards
    // If current timestamp exists and is newer, add 1 second to it
    let now = new Date().toISOString();
    if (currentConsentUpdatedAt) {
      const currentTime = new Date(currentConsentUpdatedAt).getTime();
      const newTime = new Date(now).getTime();
      if (newTime <= currentTime) {
        // Add 1 second to current timestamp to ensure it's always newer
        now = new Date(currentTime + 1000).toISOString();
        console.log('Adjusted consentUpdatedAt to be newer than current:', now);
      }
    }
      
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
          customerId,
          email,
        });
        
        // Fallback to REST API with email_marketing_consent
        // Note: REST uses lowercase strings ("not_subscribed"), not GraphQL enums
        console.log('Falling back to REST API for email_marketing_consent...');
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
          console.error('REST API fallback also failed:', {
            status: updateResponse.status,
            data: fallbackData,
            customerId,
            email,
          });
          return NextResponse.json(
            { error: 'Newsletter-Abmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.' },
            { status: 500 }
          );
        } else {
          console.log('✅ Email marketing consent updated via REST API fallback', {
            customerId,
            email,
            state: 'not_subscribed',
          });
        }
      } else {
        const consent = consentData.data?.customerEmailMarketingConsentUpdate?.emailMarketingConsent;
        console.log('✅ Consent updated successfully', {
          marketingState: consent?.marketingState,
          marketingOptInLevel: consent?.marketingOptInLevel,
          consentUpdatedAt: consent?.consentUpdatedAt,
          customerId,
          email,
        });
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
