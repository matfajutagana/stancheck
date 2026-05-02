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
    return NextResponse.json({ tracks: [], distractorPool: [] })
  }

  try {
    // Step 1 — fetch top tracks, ONLY ones with previews (these get played)
    const topRes = await fetch(
      `https://api.deezer.com/artist/${artistId}/top?limit=50`,
    )
    const topData = (await topRes.json()) as { data: DeezerTrack[] }
    const allTopTracks = topData.data ?? []
    const topTracksWithPreview = allTopTracks.filter((t) => t.preview)

    // Step 2 — fetch albums
    const albumsRes = await fetch(
      `https://api.deezer.com/artist/${artistId}/albums?limit=25`,
    )
    const albumsData = (await albumsRes.json()) as { data: DeezerAlbum[] }
    const albums = albumsData.data ?? []

    // Step 3 — fetch album tracks
    // withPreview → playable correct answers
    // all         → distractor names (no preview needed)
    async function fetchAlbumTracks(album: DeezerAlbum): Promise<{
      withPreview: DeezerTrack[]
      all: DeezerTrack[]
    }> {
      const res = await fetch(
        `https://api.deezer.com/album/${album.id}/tracks?limit=50`,
      )
      const data = (await res.json()) as { data: DeezerTrack[] }
      const mapped = (data.data ?? []).map((t) => ({
        ...t,
        album: {
          id: album.id,
          title: album.title,
          cover_big: album.cover_big,
          cover_medium: album.cover_medium,
        },
      }))
      return {
        withPreview: mapped.filter((t) => t.preview),
        all: mapped, // no preview filter — distractors just need a name
      }
    }

    const albumResults = await Promise.all(
      albums.slice(0, 12).map(fetchAlbumTracks),
    )

    const albumTracksWithPreview = albumResults.flatMap((r) => r.withPreview)
    const albumTracksAll = albumResults.flatMap((r) => r.all)

    // Step 4 — playable pool (preview required)
    const uniqueTop = deduplicateByName(topTracksWithPreview)
    const uniqueAlbumPlayable = deduplicateByName(albumTracksWithPreview)

    const topNames = new Set(
      uniqueTop.map((t) => cleanTitle(t.title).toLowerCase()),
    )
    const extraPlayable = uniqueAlbumPlayable.filter(
      (t) => !topNames.has(cleanTitle(t.title).toLowerCase()),
    )

    const playableTracks = deduplicateByName([...uniqueTop, ...extraPlayable])

    // Step 5 — distractor pool (no preview needed, just names + album info)
    // Full tracklist of every album so same-album distractors actually work
    const distractorPool = deduplicateByName([
      ...allTopTracks,
      ...albumTracksAll,
    ]).map((track) => ({
      id: String(track.id),
      name: cleanTitle(track.title),
      album: {
        name: track.album?.title ?? '',
        images: [
          { url: track.album?.cover_big ?? '', width: 640, height: 640 },
          { url: track.album?.cover_medium ?? '', width: 320, height: 320 },
        ],
      },
    }))

    // Step 6 — final shape for playable tracks
    const finalTracks = playableTracks.map((track) => ({
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

    console.log('Playable tracks:', finalTracks.length)
    console.log('Distractor pool:', distractorPool.length)

    return NextResponse.json({ tracks: finalTracks, distractorPool })
  } catch (error) {
    console.error('Deezer tracks error:', error)
    return NextResponse.json({ tracks: [], distractorPool: [] })
  }
}
