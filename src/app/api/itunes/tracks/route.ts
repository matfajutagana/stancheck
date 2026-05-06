import { NextRequest, NextResponse } from 'next/server'

interface iTunesAlbum {
  collectionId: number
  collectionName: string
  artworkUrl100: string
  releaseDate: string
  collectionType: string
}

interface iTunesTrack {
  trackId: number
  trackName: string
  previewUrl: string
  trackTimeMillis?: number
  artistId: number
  artistName: string
  collectionId: number
  collectionName: string
  artworkUrl100: string
  trackViewUrl: string
  wrapperType: string
  kind: string
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*\[.*?\]\s*/g, '')
    .replace(/\s*-\s*(feat|ft|with)\.?.*$/i, '')
    .trim()
}

function isJunkAlbum(title: string): boolean {
  return (
    /\b(live|concert|tour|unplugged|mtv|vma|at the|at madison|at staples|in concert|on tour|greatest hits|best of|collection|anthology|essential|anniversary|deluxe|remaster|orchestra|symphony|acoustic session|radio session|vault|rarities|b-sides|demo|bootleg|tribute|karaoke)\b/i.test(
      title,
    ) ||
    /- Single$/i.test(title) ||
    /- EP$/i.test(title) ||
    /\(Single\)/i.test(title) ||
    /- single$/i.test(title)
  )
}

function isJunkTrack(title: string): boolean {
  return /\b(intro|outro|interlude|skit|encore|solo|reprise|snippet|instrumental|crowd|applause|noise|silence|orchestra|overture|prelude|segue|hidden track|untitled|bonus|rehearsal|acoustic version|demo|radio edit|live version)\b/i.test(
    title,
  )
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function deduplicateByName(tracks: iTunesTrack[]): iTunesTrack[] {
  const seen = new Set<string>()
  return tracks.filter((track) => {
    const key = cleanTitle(track.trackName).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function interleaveByAlbum(tracks: iTunesTrack[]): iTunesTrack[] {
  const byAlbum = new Map<string, iTunesTrack[]>()
  for (const track of tracks) {
    const key = track.collectionName
    if (!byAlbum.has(key)) byAlbum.set(key, [])
    byAlbum.get(key)!.push(track)
  }
  const buckets = [...byAlbum.values()]
  const result: iTunesTrack[] = []
  let i = 0
  while (result.length < tracks.length) {
    const bucket = buckets[i % buckets.length]
    if (bucket && bucket.length > 0) result.push(bucket.shift()!)
    i++
  }
  return result
}

function getArtwork(url: string, size: number): string {
  return url?.replace('100x100bb', `${size}x${size}bb`) ?? ''
}

export async function GET(request: NextRequest) {
  const artistId = request.nextUrl.searchParams.get('artistId')

  if (!artistId) {
    return NextResponse.json({ tracks: [], distractorPool: [] })
  }

  try {
    // Step 1 — fetch albums for this artist
    const albumsRes = await fetch(
      `https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=50`,
    )
    const albumsData = (await albumsRes.json()) as {
      results: (iTunesAlbum & { wrapperType: string })[]
    }

    const albums = (albumsData.results ?? [])
      .filter((r) => r.wrapperType === 'collection')
      .filter((a) => !isJunkAlbum(a.collectionName))

    // Step 2 — dedup remastered/deluxe versions of same album
    const seenAlbumTitles = new Set<string>()
    const dedupedAlbums = albums.filter((a) => {
      const base = a.collectionName
        .replace(/\s*\(.*?\)\s*/g, '')
        .replace(
          /\s*(remastered|deluxe|box set|international version|taylor's version).*$/gi,
          '',
        )
        .replace(/- Single$/i, '')
        .trim()
        .toLowerCase()
      if (seenAlbumTitles.has(base)) return false
      seenAlbumTitles.add(base)
      return true
    })

    // Step 3 — fetch tracks from top 12 albums
    async function fetchAlbumTracks(album: iTunesAlbum): Promise<{
      withPreview: iTunesTrack[]
      all: iTunesTrack[]
    }> {
      const res = await fetch(
        `https://itunes.apple.com/lookup?id=${album.collectionId}&entity=song&limit=50`,
      )
      const data = (await res.json()) as { results: iTunesTrack[] }

      const mapped = (data.results ?? [])
        .filter((r) => r.wrapperType === 'track' && r.kind === 'song')
        .map((t) => ({
          ...t,
          artworkUrl100: album.artworkUrl100, // use album art
          collectionName: album.collectionName,
        }))

      return {
        withPreview: mapped.filter(
          (t) =>
            t.previewUrl &&
            !isJunkTrack(t.trackName) &&
            String(t.artistId) === String(artistId) && // ✅ strict artist match kills wrong Kamikazee
            (t.trackTimeMillis ?? 999999) >= 60000,
        ),
        all: mapped.filter(
          (t) =>
            !isJunkTrack(t.trackName) &&
            String(t.artistId) === String(artistId), // ✅ same filter for distractors
        ),
      }
    }

    const albumResults = await Promise.all(
      dedupedAlbums.slice(0, 12).map(fetchAlbumTracks),
    )

    const albumTracksWithPreview = albumResults.flatMap((r) => r.withPreview)
    const albumTracksAll = albumResults.flatMap((r) => r.all)

    // Step 4 — build playable pool
    const uniquePlayable = deduplicateByName(albumTracksWithPreview)
    const playableTracks = interleaveByAlbum(shuffleArray(uniquePlayable))

    // Step 5 — distractor pool
    const distractorPool = deduplicateByName(albumTracksAll).map((track) => ({
      id: String(track.trackId),
      name: cleanTitle(track.trackName),
      trackViewUrl: track.trackViewUrl,
      album: {
        name: track.collectionName ?? '',
        images: [
          {
            url: getArtwork(track.artworkUrl100, 640),
            width: 640,
            height: 640,
          },
          {
            url: getArtwork(track.artworkUrl100, 320),
            width: 320,
            height: 320,
          },
        ],
      },
    }))

    // Step 6 — final shape
    const finalTracks = playableTracks.map((track) => ({
      id: String(track.trackId),
      name: cleanTitle(track.trackName),
      preview_url: track.previewUrl,
      trackViewUrl: track.trackViewUrl,
      uri: String(track.trackId),
      artists: [
        {
          id: String(track.artistId),
          name: track.artistName ?? '',
        },
      ],
      album: {
        name: track.collectionName ?? '',
        images: [
          {
            url: getArtwork(track.artworkUrl100, 640),
            width: 640,
            height: 640,
          },
          {
            url: getArtwork(track.artworkUrl100, 320),
            width: 320,
            height: 320,
          },
        ],
      },
    }))

    return NextResponse.json(
      { tracks: finalTracks, distractorPool },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    )
  } catch (error) {
    console.error('iTunes tracks error:', error)
    return NextResponse.json({ tracks: [], distractorPool: [] })
  }
}
