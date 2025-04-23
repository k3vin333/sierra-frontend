// src/app/api/company-search/[query]/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Dynamic-route params must be awaited in Next 15
type Params = { query: string };

const getFinnhubApiKey = () => {
  if (process.env.FINNHUB_API_KEY) return process.env.FINNHUB_API_KEY;
  console.warn('FINNHUB_API_KEY environment variable is not set');
  return '';
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { query } = await params;

  const apiKey = getFinnhubApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`
    );

    if (!res.ok) throw new Error(`Finnhub API responded with ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Company search error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch company search results' },
      { status: 500 }
    );
  }
}
