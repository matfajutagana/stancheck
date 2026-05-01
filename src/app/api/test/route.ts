import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('spotify_access_token')

  if (!token) {
    return NextResponse.json({ error: 'no token' })
  }

  const response = await fetch(
    'https://api.spotify.com/v1/search?q=drake&type=artist&limit=1',
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    },
  )

  const text = await response.text()
  console.log('Status:', response.status)
  console.log('Full response:', text)

  return NextResponse.json({ status: response.status, body: text })
}
