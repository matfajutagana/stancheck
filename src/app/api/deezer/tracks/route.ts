import { NextRequest, NextResponse } from 'next/server'

interface DeezerTrack {
  id: number
  title: string
  preview: string
  artist: { id: number; name: string }
  album: {
    id: number
    title: string
    cover_big: string
    cover_medium: string
  }
}

interface DeezerAlbum {
  id: number
  title: string
  cover_big: string
  cover_medium: string
}

export async function GET(request: NextRequest) {
  const artistId = request.nextUrl.searchParams.get('artistId')

  if (!artistId) {
    return NextResponse.json({ tracks: [] })
  }

  try {
    // get all albums
    const albumsRes = await fetch(
      `https://api.deezer.com/artist/${artistId}/albums?limit=25`,
    )
    const albumsData = (await albumsRes.json()) as { data: DeezerAlbum[] }
    const albums = albumsData.data ?? []

    console.log('Albums found:', albums.length)

    // fetch tracks from first 5 albums sequentially to avoid rate limits
    const allTracks: DeezerTrack[] = []

    for (const album of albums.slice(0, 5)) {
      const tracksRes = await fetch(
        `https://api.deezer.com/album/${album.id}/tracks`,
      )
      const tracksData = (await tracksRes.json()) as { data: DeezerTrack[] }
      const items = tracksData.data ?? []

      const withAlbum = items.map((t) => ({
        ...t,
        album: {
          id: album.id,
          title: album.title,
          cover_big: album.cover_big,
          cover_medium: album.cover_medium,
        },
      }))

      allTracks.push(...withAlbum)
    }

    console.log('Total tracks fetched:', allTracks.length)

    const seen = new Set<string>()
    const unique = allTracks
      .filter((t) => t.preview && t.preview.length > 0)
      .filter((track) => {
        const key = track.title.toLowerCase().trim()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .map((track) => ({
        id: String(track.id),
        name: track.title
          .replace(/\s*\(.*?\)\s*/g, '')
          .replace(/\s*\[.*?\]\s*/g, '')
          .trim(),
        preview_url: track.preview,
        uri: String(track.id),
        artists: [
          {
            id: String(track.artist?.id ?? artistId),
            name: track.artist?.name ?? '',
          },
        ],
        album: {
          name: track.album?.title ?? '',
          images: [
            { url: track.album?.cover_big ?? '', width: 640, height: 640 },
            { url: track.album?.cover_medium ?? '', width: 320, height: 320 },
          ],
        },
      }))

    console.log('Unique tracks with preview:', unique.length)
    return NextResponse.json({ tracks: unique })
  } catch (error) {
    console.error('Deezer tracks error:', error)
    return NextResponse.json({ tracks: [] })
  }
}
