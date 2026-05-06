import { NextRequest, NextResponse } from 'next/server'

interface iTunesArtistResult {
  wrapperType: string
  artistId: number
  artistName: string
}

interface iTunesTrackResult {
  wrapperType: string
  artistId: number
  artworkUrl100: string
}

export async function GET(request: NextRequest) {
  const artistId = request.nextUrl.searchParams.get('artistId')

  if (!artistId) {
    return NextResponse.json({ name: '', image: '' })
  }

  try {
    // Lookup artist name + get their latest song artwork in one call
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${artistId}&entity=song&limit=1`,
    )
    const data = (await response.json()) as {
      results: (iTunesArtistResult | iTunesTrackResult)[]
    }

    const results = data.results ?? []

    // First result is the artist
    const artist = results.find(
      (r) => r.wrapperType === 'artist',
    ) as iTunesArtistResult

    // Second result is a song with artwork
    const track = results.find(
      (r) => r.wrapperType === 'track',
    ) as iTunesTrackResult

    const name = artist?.artistName ?? ''
    const image = track?.artworkUrl100
      ? track.artworkUrl100.replace('100x100bb', '640x640bb')
      : ''

    return NextResponse.json(
      { name, image },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    )
  } catch (error) {
    console.error('iTunes artist fetch error:', error)
    return NextResponse.json({ name: '', image: '' })
  }
}
