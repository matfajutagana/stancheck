import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const trackId = request.nextUrl.searchParams.get('trackId')

  if (!trackId) {
    return NextResponse.json({ error: 'No trackId' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${trackId}`)
    const data = (await res.json()) as {
      results: { previewUrl?: string }[]
    }

    const preview = data.results?.[0]?.previewUrl

    if (!preview) {
      return NextResponse.json({ error: 'No preview' }, { status: 404 })
    }

    return NextResponse.json(
      { preview_url: preview },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('Preview fetch error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
