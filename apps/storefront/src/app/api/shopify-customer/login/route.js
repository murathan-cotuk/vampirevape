import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      );
    }

    // Use Shopify Customer Account API
    // Note: This requires Shopify Customer Account API setup
    // For now, we'll use a placeholder that redirects to Shopify's auth
    // In production, you'd use the Customer Account API with proper OAuth flow
    
    const shopifyStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
    
    // For headless storefront with Customer Account API
    // Use Shopify Customer Account API OAuth flow
    // Store ID and Client ID from environment or config
    const storeId = '96950845726';
    const clientId = '588c7463-8c31-4ea9-8a58-3294fbd41218';
    const redirectUri = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/konto`
      : 'https://vampirevape.vercel.app/konto';
    
    // Generate OAuth URL for Customer Account API
    const authUrl = `https://shopify.com/authentication/${storeId}/login?client_id=${clientId}&locale=de&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid+email+customer-account-api%3Afull`;

    return NextResponse.json({
      success: true,
      authUrl, // Return auth URL for client-side redirect
      message: 'Weiterleitung zu Shopify Authentication...',
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}

