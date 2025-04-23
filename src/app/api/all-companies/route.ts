import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/all');

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch ESG data' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Error fetching all ESG data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
