import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Subscribe to newsletter - creates Shopify customer with accepts_marketing: true
 * Mailchimp will automatically sync from Shopify via Mailchimp app
 */
export async function POST(request) {
  try {
    const { email, firstName, lastName } = await request.json();

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

    // Check if customer already exists
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
      // Customer exists, update email marketing consent
      customerId = searchData.customers[0].id;
      console.log('Customer exists, updating email marketing consent to SUBSCRIBED:', customerId);

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
      
      // Use customerEmailMarketingConsentUpdate mutation
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
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN",
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
        // Note: REST uses lowercase strings ("subscribed"), not GraphQL enums
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
                  state: "subscribed",
                  opt_in_level: "single_opt_in",
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
    } else {
      // Create new customer with accepts_marketing: true
      // Mailchimp app will automatically sync from Shopify
      console.log('Creating new customer for newsletter:', email);

      const customerData = {
        customer: {
          email: email,
          first_name: firstName || '',
          last_name: lastName || '',
          accepts_marketing: true,
          verified_email: false,
        },
      };

      const createResponse = await fetch(
        `https://${shopifyStoreDomain}/admin/api/2024-10/customers.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': adminApiToken,
          },
          body: JSON.stringify(customerData),
        }
      );

      const createData = await createResponse.json();

      if (createResponse.status !== 201) {
        const errorMessage = createData.errors?.email?.[0] || 'Newsletter-Anmeldung fehlgeschlagen';
        return NextResponse.json(
          { error: errorMessage },
          { status: createResponse.status }
        );
      }

      customerId = createData.customer.id;

      // Ensure email marketing consent is set using customerEmailMarketingConsentUpdate
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
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN",
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
        // Note: REST uses lowercase strings ("subscribed"), not GraphQL enums
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
                  state: "subscribed",
                  opt_in_level: "single_opt_in",
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
      message: 'Erfolgreich für den Newsletter angemeldet!',
      customerId: customerId?.toString(),
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
