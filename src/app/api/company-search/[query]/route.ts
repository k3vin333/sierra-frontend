// src/app/api/company-search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { query: string } }
) {
  try {
    console.log('API route called with params:', params);
    // Safely access the query param
    const query = params.query;
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    console.log('Fetching from backend with query:', query);
    const res = await fetch(
      `https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/search/company/${query}`
    );
    
    if (!res.ok) {
      console.error(`Backend API error: ${res.status} ${res.statusText}`);
      return NextResponse.json({ error: 'Backend API error' }, { status: res.status });
    }
    
    const data = await res.json();
    console.log('Backend API response:', data);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching company search results:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
