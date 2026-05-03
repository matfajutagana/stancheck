import { NextRequest, NextResponse } from 'next/server'

interface DeezerTrack {
  id: number
  title: string
  preview: string
  duration?: number // ← add this
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
  fans?: number
  release_date?: string
  record_type?: string
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

function isJunkAlbum(title: string): boolean {
  return /\b(live|concert|tour|unplugged|mtv|vma|at the|at madison|at staples|in concert|on tour|greatest hits|best of|collection|anthology|essential|anniversary|deluxe|remaster|orchestra|s&m|symphony|acoustic session|radio session|vault|rarities|b-sides|demo|bootleg|tribute|karaoke)\b/i.test(
    title,
  )
}

function isJunkTrack(title: string): boolean {
  return /\b(intro|outro|interlude|skit|encore|solo|reprise|snippet|instrumental|crowd|applause|noise|silence|orchestra|overture|prelude|segue|hidden track|untitled|bonus|rehearsal|acoustic version|demo|radio edit|live version)\b/i.test(
    title,
  )
}

function isCollab(track: DeezerTrack, artistId: string): boolean {
  return String(track.artist?.id) !== String(artistId)
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Round-robin tracks across albums so no album dominates
function interleaveByAlbum(tracks: DeezerTrack[]): DeezerTrack[] {
  const byAlbum = new Map<string, DeezerTrack[]>()
  for (const track of tracks) {
    const key = track.album.title
    if (!byAlbum.has(key)) byAlbum.set(key, [])
    byAlbum.get(key)!.push(track)
  }

  const buckets = [...byAlbum.values()]
  const result: DeezerTrack[] = []
  let i = 0
  const total = tracks.length
  while (result.length < total) {
    const bucket = buckets[i % buckets.length]
    if (bucket && bucket.length > 0) result.push(bucket.shift()!)
    i++
  }
  return result
}

export async function GET(request: NextRequest) {
  const artistId = request.nextUrl.searchParams.get('artistId')

  if (!artistId) {
    return NextResponse.json({ tracks: [], distractorPool: [] })
  }

  try {
    // Step 1 — fetch top tracks (these anchor the playable pool)
    const topRes = await fetch(
      `https://api.deezer.com/artist/${artistId}/top?limit=50`,
    )
    const topData = (await topRes.json()) as { data: DeezerTrack[] }
    const allTopTracks = topData.data ?? []
    const topTracksWithPreview = allTopTracks.filter((t) => t.preview)

    // Step 2 — fetch albums with fans count, filter junk, sort by popularity
    const albumsRes = await fetch(
      `https://api.deezer.com/artist/${artistId}/albums?limit=50`,
    )
    const albumsData = (await albumsRes.json()) as { data: DeezerAlbum[] }

    const albums = (albumsData.data ?? [])
      .filter((a) => !isJunkAlbum(a.title))
      .filter((a) => a.record_type !== 'single' && a.record_type !== 'ep')
      .sort((a, b) => (b.fans ?? 0) - (a.fans ?? 0))

    // Step 3 — fetch tracks from top 12 most popular albums
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
        withPreview: mapped.filter(
          (t) =>
            t.preview &&
            !isJunkTrack(t.title) &&
            !isCollab(t, artistId!) &&
            (t.duration ?? 999) >= 60,
        ),
        all: mapped.filter((t) => !isJunkTrack(t.title)),
      }
    }

    const seenAlbumTitles = new Set<string>()
    const dedupedAlbums = albums.filter((a) => {
      const base = a.title
        .replace(/\s*\(.*?\)\s*/g, '') // strip anything in parentheses
        .replace(
          /\s*(remastered|deluxe|box set|international version).*$/gi,
          '',
        )
        .trim()
        .toLowerCase()
      if (seenAlbumTitles.has(base)) return false
      seenAlbumTitles.add(base)
      return true
    })

    const albumResults = await Promise.all(
      dedupedAlbums.slice(0, 12).map(fetchAlbumTracks),
    )

    const albumTracksWithPreview = albumResults.flatMap((r) => r.withPreview)
    const albumTracksAll = albumResults.flatMap((r) => r.all)

    // Step 4 — build playable pool
    // Top tracks first (Deezer's popularity signal), then fill from albums
    const uniqueTop = deduplicateByName(topTracksWithPreview)
    const uniqueAlbumPlayable = deduplicateByName(albumTracksWithPreview)

    const topNames = new Set(
      uniqueTop.map((t) => cleanTitle(t.title).toLowerCase()),
    )
    const extraPlayable = uniqueAlbumPlayable.filter(
      (t) => !topNames.has(cleanTitle(t.title).toLowerCase()),
    )

    // Interleave album tracks so no single album dominates
    const interleavedExtra = interleaveByAlbum(extraPlayable)

    // Top tracks shuffled + interleaved album tracks
    const playableTracks = deduplicateByName([
      ...shuffleArray(uniqueTop),
      ...interleavedExtra,
    ])

    // Step 5 — distractor pool
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

    // Step 6 — final shape
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

    return NextResponse.json(
      { tracks: finalTracks, distractorPool },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
        },
      },
    )
  } catch (error) {
    console.error('Deezer tracks error:', error)
    return NextResponse.json({ tracks: [], distractorPool: [] })
  }
}
