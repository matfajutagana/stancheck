import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'No URL' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'audio/mpeg, audio/*',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
    }

    const contentType = response.headers.get('content-type') ?? 'audio/mpeg'
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Length': buffer.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Audio proxy error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
