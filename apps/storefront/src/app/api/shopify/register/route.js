import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Register new customer with Shopify Admin API
 */
export async function POST(request) {
  try {
    const formData = await request.json();

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
    const searchQuery = `email:"${formData.email}"`;
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
    if (searchData.customers && searchData.customers.length > 0) {
      return NextResponse.json(
        { error: 'Diese E-Mail-Adresse ist bereits registriert.' },
        { status: 400 }
      );
    }

    // Prepare customer data
    // Debug: Check newsletter value
    console.log('Newsletter value from form:', formData.newsletter, 'Type:', typeof formData.newsletter);
    const acceptsMarketing = formData.newsletter === true || formData.newsletter === 'true';
    console.log('accepts_marketing will be set to:', acceptsMarketing);
    
    const customerData = {
      customer: {
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirm,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.telefonnummer || '',
        verified_email: false, // Will be verified via email
        accepts_marketing: acceptsMarketing,
        addresses: [
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            address1: formData.strasse,
            address2: formData.adresszusatz || '',
            city: formData.ort,
            zip: formData.plz,
            country: 'DE',
            province: formData.bundesland,
            default: true,
          },
        ],
        metafields: [
          {
            key: 'anrede',
            value: formData.anrede,
            type: 'single_line_text_field',
            namespace: 'custom',
          },
          {
            key: 'geburtsdatum',
            value: formData.geburtsdatum,
            type: 'date',
            namespace: 'custom',
          },
        ],
      },
    };

    // Add shipping address if different
    if (formData.differentShipping) {
      customerData.customer.addresses.push({
        first_name: formData.firstName,
        last_name: formData.lastName,
        address1: formData.shippingStrasse,
        address2: formData.shippingAdresszusatz || '',
        city: formData.shippingOrt,
        zip: formData.shippingPlz,
        country: 'DE',
        province: formData.shippingBundesland,
        default: false,
      });
    }

    // Create customer
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
    
    console.log('Customer created. Full response:', JSON.stringify(createData, null, 2));
    console.log('Customer created. Response accepts_marketing:', createData.customer?.accepts_marketing);

    if (createResponse.status !== 201) {
      const errorMessage = createData.errors?.email?.[0] || 
                          createData.errors?.password?.[0] || 
                          createData.errors?.base?.[0] ||
                          'Registrierung fehlgeschlagen';
      return NextResponse.json(
        { error: errorMessage },
        { status: createResponse.status }
      );
    }

    const customerId = createData.customer.id;
    console.log('Customer ID:', customerId);
    console.log('Customer accepts_marketing after creation:', createData.customer?.accepts_marketing);

    // Update customer's email marketing consent
    // Use Admin GraphQL API customerEmailMarketingConsentUpdate mutation
    // This ensures proper "subscribed" state in Shopify, which Mailchimp app will sync
    try {
      const now = new Date().toISOString();
      
      // Use customerEmailMarketingConsentUpdate mutation to set proper consent state
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
            marketingState: acceptsMarketing ? "SUBSCRIBED" : "NOT_SUBSCRIBED",
            // Note: SINGLE_OPT_IN is correct for checkbox-based consent
            // If double opt-in is enabled in Shopify settings, state may show as "PENDING" until confirmed
            // CONFIRMED_OPT_IN should only be used when user has actually confirmed via email
            marketingOptInLevel: acceptsMarketing ? "SINGLE_OPT_IN" : "UNKNOWN",
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
        // Note: REST uses lowercase strings ("subscribed", "not_subscribed"), not GraphQL enums
        console.log('Falling back to REST API with email_marketing_consent...');
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
                  state: acceptsMarketing ? "subscribed" : "not_subscribed",
                  opt_in_level: acceptsMarketing ? "single_opt_in" : "unknown",
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
    } catch (updateError) {
      console.error('Error updating customer marketing consent:', updateError);
      // Don't fail registration if marketing update fails
    }
    
    // Mailchimp will automatically sync from Shopify via Mailchimp app
    // When accepts_marketing is set to true, Mailchimp app will automatically add customer to Mailchimp
    // No direct API calls needed - Shopify is the source of truth

    return NextResponse.json({
      success: true,
      customerId: createData.customer.id.toString(),
      message: 'Registrierung erfolgreich. Bitte überprüfen Sie Ihre E-Mail zur Bestätigung.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
