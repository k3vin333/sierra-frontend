import { NextRequest, NextResponse } from 'next/server';

const LOGO_API_TOKEN = process.env.LOGO_API_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  
  if (!domain) {
    return NextResponse.json({ error: 'Domain Params missing' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://img.logo.dev/${domain}?token=${LOGO_API_TOKEN}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Logo fetch failed' }, { status: response.status });
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
    return NextResponse.json({ error: 'Logo fetch failed' }, { status: 500 });
  }
} 