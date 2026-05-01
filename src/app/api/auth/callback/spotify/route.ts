import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(
      new URL('http://127.0.0.1:3000/?error=no_code'),
    )
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
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://127.0.0.1:3000/api/auth/callback/spotify',
    }),
  })

  const tokens = (await response.json()) as {
    access_token: string
    refresh_token: string
    expires_in: number
    error?: string
    error_description?: string
  }

  console.log('Token response:', JSON.stringify(tokens))

  if (tokens.error) {
    return NextResponse.redirect(
      new URL(`http://127.0.0.1:3000/?error=${tokens.error}`),
    )
  }

  const redirectResponse = NextResponse.redirect(
    new URL('http://127.0.0.1:3000/search'),
  )

  redirectResponse.cookies.set('spotify_access_token', tokens.access_token, {
    httpOnly: true,
    maxAge: tokens.expires_in,
    path: '/',
    sameSite: 'lax',
  })

  redirectResponse.cookies.set('spotify_refresh_token', tokens.refresh_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
  })

  return redirectResponse
}
