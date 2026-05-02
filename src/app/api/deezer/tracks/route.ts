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

function cleanTitle(title: string): string {
  return title
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*\[.*?\]\s*/g, '')
    .replace(/\s*-\s*(feat|ft|with)\.?.*$/i, '')
    .trim()
}

function deduplicateByName(tracks: DeezerTrack[]): DeezerTrack[] {
  const seen = new Set<string>()
  return tracks.filter((track) => {
    const key = cleanTitle(track.title).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function GET(request: NextRequest) {
  const artistId = request.nextUrl.searchParams.get('artistId')

  if (!artistId) {
    return NextResponse.json({ tracks: [] })
  }

  try {
    // Step 1 — fetch top tracks (popular hits)
    const topRes = await fetch(
      `https://api.deezer.com/artist/${artistId}/top?limit=50`,
    )
    const topData = (await topRes.json()) as { data: DeezerTrack[] }
    const topTracks = (topData.data ?? []).filter((t) => t.preview)

    console.log('Top tracks with preview:', topTracks.length)

    // Step 2 — fetch albums for deep cuts
    const albumsRes = await fetch(
      `https://api.deezer.com/artist/${artistId}/albums?limit=20`,
    )
    const albumsData = (await albumsRes.json()) as { data: DeezerAlbum[] }
    const albums = albumsData.data ?? []

    console.log('Albums found:', albums.length)

    // Step 3 — get tracks from 3 random albums
    const albumTracks: DeezerTrack[] = []
    const pickedAlbums = albums.slice(0, 5)

    for (const album of pickedAlbums) {
      const res = await fetch(
        `https://api.deezer.com/album/${album.id}/tracks?limit=20`,
      )
      const data = (await res.json()) as { data: DeezerTrack[] }
      const items = (data.data ?? [])
        .filter((t) => t.preview)
        .map((t) => ({
          ...t,
          album: {
            id: album.id,
            title: album.title,
            cover_big: album.cover_big,
            cover_medium: album.cover_medium,
          },
        }))
      albumTracks.push(...items)
    }

    console.log('Album tracks with preview:', albumTracks.length)

    // Step 4 — deduplicate top tracks first
    const uniqueTopTracks = deduplicateByName(topTracks)

    // Step 5 — take top 5 as "easy" questions
    const easyTracks = uniqueTopTracks.slice(0, 5)

    // Step 6 — combine remaining top tracks + album tracks for deep cuts pool
    const deepCutPool = deduplicateByName([
      ...uniqueTopTracks.slice(5),
      ...albumTracks,
    ])

    // Step 7 — filter out songs already in easy tracks
    const easyNames = new Set(
      easyTracks.map((t) => cleanTitle(t.title).toLowerCase()),
    )
    const hardTracks = deepCutPool
      .filter((t) => !easyNames.has(cleanTitle(t.title).toLowerCase()))
      .slice(0, 20)

    // Step 8 — combine: easy first, then deep cuts
    const finalTracks = [...easyTracks, ...hardTracks].map((track) => ({
      id: String(track.id),
      name: cleanTitle(track.title),
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

    console.log('Final tracks:', finalTracks.length)
    console.log('Easy (top hits):', easyTracks.length)
    console.log('Deep cuts:', hardTracks.length)

    return NextResponse.json({ tracks: finalTracks })
  } catch (error) {
    console.error('Deezer tracks error:', error)
    return NextResponse.json({ tracks: [] })
  }
}
