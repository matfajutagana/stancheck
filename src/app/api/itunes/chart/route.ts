import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // iTunes top 100 songs chart
    const res = await fetch(
      'https://itunes.apple.com/us/rss/topsongs/limit=50/json',
    )
    const data = (await res.json()) as {
      feed: {
        entry: {
          id: { attributes: { 'im:id': string } }
          'im:image': { label: string }[]
        }[]
      }
    }

    const entries = data.feed?.entry ?? []

    const covers = entries
      .map((entry) => ({
        id: `track-${entry.id.attributes['im:id']}`,
        // last image in array is largest
        url: entry['im:image']?.[2]?.label ?? '',
      }))
      .filter((c) => c.url)

    return NextResponse.json(
      { covers },
      {
        headers: {
          // Chart data can be cached - it's just metadata
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    )
  } catch (error) {
    console.error('Chart error:', error)
    return NextResponse.json({ covers: [] })
  }
}
