import { NextResponse } from 'next/server';

interface RouteParams {
  params: {
    query: string;
  };
}

export async function GET(
  request: Request,
  { params }: RouteParams
){
  try {
    const res = await fetch(`https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/search/company/${params.query}`);
    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to fetch companies:', error); 
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
