import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken, user } = await request.json();

    const response = NextResponse.json({ success: true });

    response.cookies.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Set user data cookie for middleware access
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
    console.error('Set cookies error:', error);
    return NextResponse.json({ error: 'Failed to set cookies' }, { status: 500 });
  }
}