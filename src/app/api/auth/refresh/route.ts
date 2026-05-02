import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const refreshToken = request.cookies.get('spotify_refresh_token')

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken.value,
    }),
  })

  const tokens = (await response.json()) as {
    access_token: string
    expires_in: number
    error?: string
  }

  if (tokens.error) {
    return NextResponse.json({ error: tokens.error }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })

  res.cookies.set('spotify_access_token', tokens.access_token, {
    httpOnly: true,
    maxAge: tokens.expires_in,
    path: '/',
    sameSite: 'lax',
  })

  return res
}
