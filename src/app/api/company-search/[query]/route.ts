// src/app/api/company-search/[query]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { query: string } }
) {
  const query = params.query;
  
  try {
    // Your existing implementation here
    const response = await fetch(`YOUR_API_ENDPOINT/${query}`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}