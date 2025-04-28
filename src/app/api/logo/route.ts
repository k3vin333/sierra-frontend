import { NextRequest, NextResponse } from 'next/server';

const LOGO_API_TOKEN = process.env.LOGO_API_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  
  if (!domain) {
    return NextResponse.json({ error: 'Domain Params missing' }, { status: 400 });
  }

  try {
    // If no API token is available, use a fallback free logo service
    if (!LOGO_API_TOKEN) {
      // Redirect to a free logo service (clearbit in this case)
      return NextResponse.redirect(`https://logo.clearbit.com/${domain}?size=128`);
    }
    
    const response = await fetch(`https://img.logo.dev/${domain}?token=${LOGO_API_TOKEN}`);
    
    if (!response.ok) {
      // If logo.dev fails, try the fallback
      return NextResponse.redirect(`https://logo.clearbit.com/${domain}?size=128`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error fetching logo:', error);
    // On any error, use the fallback
    return NextResponse.redirect(`https://logo.clearbit.com/${domain}?size=128`);
  }
} 