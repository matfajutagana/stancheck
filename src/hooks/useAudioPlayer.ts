import { useRef, useCallback, useState } from 'react'

export function useAudioPlayer(onTrackReady?: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isReady] = useState(true)
  const [needsInteraction, setNeedsInteraction] = useState(false)
  const pendingTrackIdRef = useRef<string | null>(null)

  const playTrack = useCallback(
    async (trackId: string) => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }

      try {
        // fetch fresh preview URL at play time — never expired
        const res = await fetch(`/api/deezer/preview?trackId=${trackId}`)
        const data = (await res.json()) as {
          preview_url?: string
          error?: string
        }

        if (!data.preview_url) {
          console.warn('No preview URL for track:', trackId)
          onTrackReady?.() // skip this track
          return
        }

        const audio = new Audio(data.preview_url)
        audioRef.current = audio

        audio.addEventListener('canplaythrough', () => {
          audio
            .play()
            .then(() => {
              setNeedsInteraction(false)
              onTrackReady?.()
            })
            .catch((err) => {
              if (err.name === 'NotAllowedError') {
                console.log('Needs user interaction first')
                pendingTrackIdRef.current = trackId
                setNeedsInteraction(true)
              } else {
                console.error('Play failed:', err)
              }
            })
        })

        audio.addEventListener('error', () => {
          console.warn('Audio error code:', audio.error?.code)
          onTrackReady?.() // skip broken track
        })

        audio.load()
      } catch (err) {
        console.error('Failed to fetch preview URL:', err)
        onTrackReady?.()
      }
    },
    [onTrackReady],
  )

  const resumeAfterInteraction = useCallback(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setNeedsInteraction(false)
          onTrackReady?.()
        })
        .catch(console.error)
    }
  }, [onTrackReady])

  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const stopTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
  }, [])

  return {
    isReady,
    needsInteraction,
    playTrack,
    pauseTrack,
    stopTrack,
    resumeAfterInteraction,
  }
}
