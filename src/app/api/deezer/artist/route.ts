import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const artistId = request.nextUrl.searchParams.get('artistId')

  if (!artistId) {
    return NextResponse.json({ name: '', image: '' })
  }

  try {
    const response = await fetch(`https://api.deezer.com/artist/${artistId}`)
    const data = (await response.json()) as {
      name: string
      picture_big: string
    }

    return NextResponse.json({
      name: data.name,
      image: data.picture_big,
    })
  } catch (error) {
    console.error('Artist fetch error:', error)
    return NextResponse.json({ name: '', image: '' })
  }
}
