import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found' }, { status: 404 });
    }

    return NextResponse.json({ refreshToken });
  } catch (error) {
    console.error('Get refresh token error:', error);
    return NextResponse.json({ error: 'Failed to get refresh token' }, { status: 500 });
  }
}