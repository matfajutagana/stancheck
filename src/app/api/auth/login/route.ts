import { redirect } from 'next/navigation'

export async function GET() {
  const scopes = [
    'user-read-email',
    'user-read-private',
    'user-top-read',
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state',
  ].join(' ')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID ?? '',
    scope: scopes,
    redirect_uri: 'http://127.0.0.1:3000/api/auth/callback/spotify',
  })

  redirect(`https://accounts.spotify.com/authorize?${params.toString()}`)
}
