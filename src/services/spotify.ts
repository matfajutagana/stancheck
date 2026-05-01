import type { SpotifyArtist, SpotifyTrack } from '@/types'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

async function spotifyFetch<T>(
  endpoint: string,
  accessToken: string,
): Promise<T> {
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function searchArtist(
  query: string,
  accessToken: string,
): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch<{
    artists: { items: SpotifyArtist[] }
  }>(`/search?q=${encodeURIComponent(query)}&type=artist&limit=5`, accessToken)

  return data.artists.items
}

export async function getArtistTopTracks(
  artistId: string,
  accessToken: string,
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
    `/artists/${artistId}/top-tracks?market=CA`,
    accessToken,
  )

  return data.tracks
}

export async function getArtistAlbumTracks(
  artistId: string,
  accessToken: string,
): Promise<SpotifyTrack[]> {
  const albums = await spotifyFetch<{ items: { id: string }[] }>(
    `/artists/${artistId}/albums?limit=10&include_groups=album,single&market=CA`,
    accessToken,
  )

  const trackPromises = albums.items
    .slice(0, 5)
    .map((album) =>
      spotifyFetch<{ items: SpotifyTrack[] }>(
        `/albums/${album.id}/tracks?limit=5`,
        accessToken,
      ),
    )

  const albumTracks = await Promise.all(trackPromises)
  return albumTracks.flatMap((album) => album.items)
}
