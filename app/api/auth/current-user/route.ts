import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    const userDataCookie = request.cookies.get('user_data')?.value;

    if (!authToken || !userDataCookie) {
      return NextResponse.json({ user: null, token: null });
    }

    const user = JSON.parse(userDataCookie);

    return NextResponse.json({
      user,
      token: authToken
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ user: null, token: null });
  }
}