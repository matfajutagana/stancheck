'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SpotifyArtist } from '@/types'

export default function ArtistSearch() {
  const [query, setQuery] = useState('')
  const [artists, setArtists] = useState<SpotifyArtist[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSearch(value: string) {
    setQuery(value)
    if (value.length < 2) {
      setArtists([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(value)}`,
      )
      const data = (await res.json()) as { artists?: SpotifyArtist[] }
      console.log('Search response:', data)
      setArtists(data.artists ?? [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSelectArtist(artist: SpotifyArtist) {
    router.push(`/quiz/${artist.id}`)
  }

  return (
    <div className='relative w-full'>
      <input
        type='text'
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder='e.g. Drake, Kendrick, The Weeknd...'
        className='w-full bg-zinc-900 text-white border border-zinc-700 rounded-full px-6 py-4 text-lg focus:outline-none focus:border-green-400 transition-colors'
      />

      {loading && (
        <div className='absolute top-full mt-2 w-full text-center text-zinc-500 text-sm'>
          Searching...
        </div>
      )}

      {artists.length > 0 && (
        <div className='absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden z-10'>
          {artists.map((artist) => (
            <button
              key={artist.id}
              onClick={() => handleSelectArtist(artist)}
              className='w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-800 transition-colors text-left'
            >
              {artist.images[0] && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  width={40}
                  height={40}
                  className='rounded-full object-cover w-10 h-10'
                />
              )}
              <span className='text-white font-medium'>{artist.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
