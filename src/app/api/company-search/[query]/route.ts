// src/app/api/company-search/[query]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Update the type definition to match Next.js App Router expectations
type RouteParams = {
  params: {
    query: string;
  };
};

// Use environment variable for API key - ensure it's consistent with the frontend approach
const getFinnhubApiKey = () => {
  // Server components should use process.env directly (not NEXT_PUBLIC)
  if (process.env.FINNHUB_API_KEY) {
    return process.env.FINNHUB_API_KEY;
  }
  
  // For development - warning message but use a placeholder
  console.warn('FINNHUB_API_KEY environment variable is not set');
  return '';
};

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  const query = context.params.query;
  const apiKey = getFinnhubApiKey();
  
  // If no API key is available, return an error
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 }
    );
  }
  
  try {
    // Use the actual Finnhub API for symbol lookup
    const response = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Finnhub API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Company search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company search results' },
      { status: 500 }
    );
  }
}