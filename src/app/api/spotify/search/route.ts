import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('spotify_access_token')
  const query = request.nextUrl.searchParams.get('q')

  if (!token) {
    return NextResponse.json({ artists: [] })
  }

  if (!query) {
    return NextResponse.json({ artists: [] })
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    )

    const text = await response.text()
    console.log('Spotify search response:', text.substring(0, 200))

    const data = JSON.parse(text)
    const artists = data?.artists?.items ?? []

    return NextResponse.json({ artists })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ artists: [] })
  }
}
