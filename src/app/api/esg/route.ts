import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker')?.toUpperCase();
  
  if (!ticker) {
    return NextResponse.json({ error: 'Ticker parameter required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/esg/${ticker}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Fetching ESG data failed' }, { status: response.status });
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching ESG data:', error);
    return NextResponse.json({ error: 'Fetching ESG data failed' }, { status: 500 });
  }
} 

