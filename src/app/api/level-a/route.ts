// app/api/level-a/route.ts
import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const res = await fetch('https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/search/level/total_level/A');

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch companies' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Error fetching level A data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
