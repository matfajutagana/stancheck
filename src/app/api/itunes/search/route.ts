import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json({ artists: [] })

  try {
    // Step 1 — search for artists by name
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=musicArtist&limit=5`,
    )
    const data = (await response.json()) as {
      results: { wrapperType: string; artistId: number; artistName: string }[]
    }

    const artistResults = (data.results ?? []).filter(
      (r) => r.wrapperType === 'artist',
    )

    // Step 2 — for each artist do individual lookup to get their own artwork
    const artists = await Promise.all(
      artistResults.map(async (artist) => {
        const res = await fetch(
          `https://itunes.apple.com/lookup?id=${artist.artistId}&entity=song&limit=10`,
        )
        const d = (await res.json()) as {
          results: {
            wrapperType: string
            artistId: number
            artworkUrl100?: string
          }[]
        }

        // Find a song that belongs to THIS artist specifically
        const track = d.results.find(
          (r) =>
            r.wrapperType === 'track' &&
            r.artistId === artist.artistId &&
            r.artworkUrl100,
        )

        const artwork =
          track?.artworkUrl100?.replace('100x100bb', '640x640bb') ?? ''

        return {
          id: String(artist.artistId),
          name: artist.artistName,
          images: [
            { url: artwork, width: 640, height: 640 },
            {
              url: artwork.replace('640x640bb', '320x320bb'),
              width: 320,
              height: 320,
            },
          ],
        }
      }),
    )

    return NextResponse.json(
      { artists },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('iTunes search error:', error)
    return NextResponse.json({ artists: [] })
  }
}
