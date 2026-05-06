'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { SpotifyArtist } from '@/types'

export default function ArtistSearch() {
  const [query, setQuery] = useState('')
  const [artists, setArtists] = useState<SpotifyArtist[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear previous timer
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.length < 2) {
      setArtists([])
      setLoading(false)
      return
    }

    // Wait 500ms after user stops typing
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/itunes/search?q=${encodeURIComponent(query)}`,
        )
        const data = (await res.json()) as { artists?: SpotifyArtist[] }
        setArtists(data.artists ?? [])
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }, 500)

    // Cleanup on unmount
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  function handleSelectArtist(artist: SpotifyArtist) {
    router.push(`/quiz/${artist.id}`)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minWidth: 0,
        minHeight: '52px',
      }}
    >
      <input
        type='text'
        inputMode='search'
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck={false}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='e.g. Taylor Swift, Drake, Bad Bunny...'
        style={{
          width: '100%',
          maxWidth: '100%',
          display: 'block',
          background: '#fff',
          border: '1.5px solid var(--cream-border)',
          borderRadius: '10px',
          padding: '14px 16px',
          fontSize: '16px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-primary)',
          outline: 'none',
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
        }}
      />

      {loading && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '8px',
            letterSpacing: '0.1em',
          }}
        >
          searching...
        </p>
      )}

      {artists.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            width: '100%',
            background: '#fff',
            border: '0.5px solid var(--cream-border)',
            borderRadius: '10px',
            overflow: 'hidden',
            zIndex: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            boxSizing: 'border-box',
          }}
        >
          {artists.map((artist, i) => (
            <button
              key={artist.id}
              onClick={() => handleSelectArtist(artist)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                background: 'transparent',
                border: 'none',
                borderBottom:
                  i < artists.length - 1
                    ? '0.5px solid var(--cream-border)'
                    : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  width: '16px',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              {artist.images[0]?.url && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  width={36}
                  height={36}
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                    width: '36px',
                    height: '36px',
                  }}
                />
              )}
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
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
