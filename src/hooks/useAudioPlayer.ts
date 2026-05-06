import { useRef, useCallback, useState } from 'react'

export function useAudioPlayer(onTrackReady?: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isReady] = useState(true)
  const [needsInteraction, setNeedsInteraction] = useState(false)
  const pendingTrackIdRef = useRef<string | null>(null)

  const playTrack = useCallback(
    async (previewUrl: string) => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }

      // ✅ Route through proxy to handle CORS
      const proxiedUrl = `/api/audio?url=${encodeURIComponent(previewUrl)}`
      const audio = new Audio(proxiedUrl)
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
              pendingTrackIdRef.current = previewUrl
              setNeedsInteraction(true)
            } else {
              console.error('Play failed:', err)
            }
          })
      })

      audio.addEventListener('error', () => {
        console.warn('Audio error code:', audio.error?.code)
        onTrackReady?.()
      })

      audio.load()
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
