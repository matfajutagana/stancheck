import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('spotify_access_token')
  const artistId = request.nextUrl.searchParams.get('artistId')

  if (!token || !artistId) {
    return NextResponse.json({ tracks: [] })
  }

  try {
    const albumsRes = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=10&market=PH`,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      },
    )

    const albumsText = await albumsRes.text()
    console.log('Albums status:', albumsRes.status)
    const albumsData = JSON.parse(albumsText)
    const albums = albumsData?.items ?? []

    console.log('Albums count:', albums.length)

    const trackPromises = albums
      .slice(0, 5)
      .map(async (album: { id: string }) => {
        const res = await fetch(
          `https://api.spotify.com/v1/albums/${album.id}/tracks?limit=3`,
          {
            headers: { Authorization: `Bearer ${token.value}` },
          },
        )
        const data = JSON.parse(await res.text())
        return data?.items ?? []
      })

    const trackArrays = await Promise.all(trackPromises)
    const tracks = trackArrays.flat()

    console.log('Total tracks:', tracks.length)

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error('Tracks error:', error)
    return NextResponse.json({ tracks: [] })
  }
}
