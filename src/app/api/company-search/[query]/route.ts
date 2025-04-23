<<<<<<< HEAD
// src/app/api/company-search/[query]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { query: string } }) {
=======
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { query: string } }
) {
>>>>>>> decdc2b3387840986ae97fa4641c85a0ec0856b8
  const query = params.query;

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/search/company/${query}`
    );
    const data = await res.json();

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