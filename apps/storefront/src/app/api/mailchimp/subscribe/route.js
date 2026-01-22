import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Subscribe email to Mailchimp newsletter
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

    const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
    const mailchimpListId = process.env.MAILCHIMP_LIST_ID;
    const mailchimpServer = process.env.MAILCHIMP_SERVER || 'us1';

    if (!mailchimpApiKey || !mailchimpListId) {
      return NextResponse.json(
        { error: 'Mailchimp ist nicht konfiguriert.' },
        { status: 500 }
      );
    }

    // Get the server prefix from API key (format: xxxxx-us1)
    const serverMatch = mailchimpApiKey.match(/-([a-z0-9]+)$/);
    const server = serverMatch ? serverMatch[1] : mailchimpServer;

    const mailchimpResponse = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailchimpApiKey}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName || '',
            LNAME: lastName || '',
          },
        }),
      }
    );

    const mailchimpData = await mailchimpResponse.json();

    if (!mailchimpResponse.ok) {
      // If user is already subscribed, that's okay
      if (mailchimpData.title === 'Member Exists') {
        return NextResponse.json({
          success: true,
          message: 'Sie sind bereits für den Newsletter angemeldet.',
        });
      }

      return NextResponse.json(
        { error: mailchimpData.detail || 'Newsletter-Anmeldung fehlgeschlagen.' },
        { status: mailchimpResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Erfolgreich für den Newsletter angemeldet!',
    });
  } catch (error) {
    console.error('Mailchimp subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
