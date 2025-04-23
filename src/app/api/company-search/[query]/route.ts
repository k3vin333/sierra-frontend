// src/app/api/company-search/[query]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Update the type definition to match Next.js App Router expectations
// NextJS 15.2.5 requires a specific format for route params
type Params = {
  query: string;
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
  { params }: { params: Params }
) {
  const query = params.query;
  
  try {
    // Use the ESG API's company search endpoint instead of Finnhub
    const response = await fetch(`https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/search/company/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`ESG API responded with status: ${response.status}`);
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