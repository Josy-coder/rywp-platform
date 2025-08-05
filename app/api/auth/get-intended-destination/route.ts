import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const destination = request.cookies.get('intended_destination')?.value;

    const response = NextResponse.json({
      destination: destination || null
    });


    if (destination) {
      response.cookies.set('intended_destination', '', {
        maxAge: 0,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Get intended destination error:', error);
    return NextResponse.json({ destination: null });
  }
}