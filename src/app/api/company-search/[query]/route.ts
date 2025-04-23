import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { query: string } }) {
  try {
    const res = await fetch(`https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/search/company/${params.query}`);
    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
