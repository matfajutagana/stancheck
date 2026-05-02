import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://api.deezer.com/chart')
    const data = (await res.json()) as {
      tracks: {
        data: { album: { id: number; title: string; cover_medium: string } }[]
      }
      artists: { data: { id: number; name: string; picture_medium: string }[] }
    }

    const albumCovers = (data.tracks?.data ?? []).map((t) => ({
      id: `album-${t.album.id}`,
      url: t.album.cover_medium,
    }))

    const artistCovers = (data.artists?.data ?? []).map((a) => ({
      id: `artist-${a.id}`,
      url: a.picture_medium,
    }))

    const covers = [...albumCovers, ...artistCovers].filter((c) => c.url)

    return NextResponse.json({ covers })
  } catch (error) {
    console.error('Chart error:', error)
    return NextResponse.json({ covers: [] })
  }
}
