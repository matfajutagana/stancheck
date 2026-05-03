import { NextRequest, NextResponse } from 'next/server'

interface DeezerArtist {
  id: number
  name: string
  picture_medium: string
  picture_big: string
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')

  if (!query) {
    return NextResponse.json({ artists: [] })
  }

  try {
    const response = await fetch(
      `https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}&limit=5`,
    )

    const data = (await response.json()) as { data: DeezerArtist[] }

    const artists = (data.data ?? []).map((artist) => ({
      id: String(artist.id),
      name: artist.name,
      images: [
        { url: artist.picture_big, width: 640, height: 640 },
        { url: artist.picture_medium, width: 320, height: 320 },
      ],
    }))

    return NextResponse.json(
      { artists },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    )
  } catch (error) {
    console.error('Deezer search error:', error)
    return NextResponse.json({ artists: [] })
  }
}
