import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json();
    const refreshToken = request.cookies.get('refresh_token')?.value;
    const authToken = request.cookies.get('auth_token')?.value;

    if (!refreshToken || !authToken) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set('user_data', JSON.stringify({
      id: user.id,
      email: user.email,
      globalRole: user.globalRole,
      isGlobalAdmin: user.isGlobalAdmin,
      isSuperAdmin: user.isSuperAdmin,
      hasTemporaryAdmin: user.hasTemporaryAdmin,
      hubMemberships: user.hubMemberships.map((m: any) => ({
        hubId: m.hubId,
        role: m.role,
        hubName: m.hub?.name || ''
      }))
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh user data error:', error);
    return NextResponse.json({ error: 'Failed to refresh user data' }, { status: 500 });
  }
}