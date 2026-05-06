import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'No URL' }, { status: 400 })
  }

  if (!url.startsWith('https://audio-ssl.itunes.apple.com/')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'audio/mpeg, audio/*',
      },
      cache: 'no-store',
    })

    if (!response.ok || !response.body) {
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') ?? 'audio/mpeg',
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
        Pragma: 'no-cache',
        Expires: '0',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Audio proxy error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
