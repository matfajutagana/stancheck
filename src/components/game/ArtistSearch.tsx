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
      <div className='relative'>
        <div className='absolute inset-0 bg-[#ff3e3e] translate-x-1 translate-y-1' />
        <input
          type='text'
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder='e.g. Deftones, Metallica, Drake'
          className='relative w-full bg-[#0a0a0a] text-[#e8e0d0] border-2 border-[#e8e0d0] px-6 py-4 text-lg focus:outline-none focus:border-[#ff3e3e] transition-colors placeholder-zinc-600'
          style={{ fontFamily: 'var(--font-special-elite)' }}
        />
      </div>

      {loading && (
        <div className='mt-3 text-center text-zinc-500 text-sm font-mono animate-pulse'>
          searching...
        </div>
      )}

      {artists.length > 0 && (
        <div className='absolute top-full mt-2 w-full bg-[#111] border-2 border-[#e8e0d0] overflow-hidden z-10'>
          {artists.map((artist, i) => (
            <button
              key={artist.id}
              onClick={() => handleSelectArtist(artist)}
              className='w-full flex items-center gap-4 px-4 py-3 hover:bg-[#1a1a1a] transition-colors text-left border-b border-zinc-800 last:border-0'
            >
              <span className='text-zinc-600 font-mono text-xs w-4'>
                {i + 1}
              </span>
              {artist.images[0] && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  width={36}
                  height={36}
                  className='object-cover w-9 h-9 grayscale'
                />
              )}
              <span
                className='text-[#e8e0d0] font-medium'
                style={{ fontFamily: 'var(--font-special-elite)' }}
              >
                {artist.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
