// src/app/api/company-search/[query]/route.ts
import { type NextRequest, NextResponse } from 'next/server';

type Params = { query: string };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }   // ← NEW: params is a Promise
) {
  const { query } = await params;           // ← NEW: await the promise

  try {
    const res = await fetch(
      `https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/search/company/${encodeURIComponent(
        query,
      )}`,
    );

    if (!res.ok) {
      throw new Error(`ESG API responded with status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Company search error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch company search results' },
      { status: 500 },
    );
  }
}
