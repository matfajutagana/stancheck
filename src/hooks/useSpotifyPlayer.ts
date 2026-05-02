'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    Spotify: {
      Player: new (config: {
        name: string
        getOAuthToken: (cb: (token: string) => void) => void
        volume: number
      }) => SpotifyPlayerInstance
    }
    onSpotifyWebPlaybackSDKReady: () => void
  }
}

interface SpotifyPlayerInstance {
  connect: () => Promise<boolean>
  disconnect: () => void
  addListener: (event: string, callback: (data: unknown) => void) => void
  getCurrentState: () => Promise<PlayerState | null>
  pause: () => Promise<void>
  resume: () => Promise<void>
}

interface PlayerState {
  paused: boolean
  position: number
  duration: number
  track_window: {
    current_track: {
      id: string
      name: string
      uri: string
    }
  }
}

export function useSpotifyPlayer(
  accessToken: string,
  onTrackReady?: () => void,
) {
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const playerRef = useRef<SpotifyPlayerInstance | null>(null)
  const currentUriRef = useRef<string | null>(null)
  const onTrackReadyRef = useRef(onTrackReady)

  useEffect(() => {
    onTrackReadyRef.current = onTrackReady
  }, [onTrackReady])

  useEffect(() => {
    if (!accessToken) return

    setIsReady(false)
    setDeviceId(null)

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.disconnect()
        playerRef.current = null
      }

      const player = new window.Spotify.Player({
        name: 'StanCheck',
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.8,
      })

      player.addListener('ready', (data) => {
        const { device_id } = data as { device_id: string }
        console.log('SDK ready, verifying with Spotify servers...')

        const checkDevice = async (retries = 10): Promise<void> => {
          const res = await fetch(
            'https://api.spotify.com/v1/me/player/devices',
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          )
          const json = (await res.json()) as { devices: { id: string }[] }
          const found = json.devices?.some((d) => d.id === device_id)

          if (found) {
            console.log('Device confirmed on Spotify servers!')
            setDeviceId(device_id)
            setIsReady(true)
          } else if (retries > 0) {
            console.log(`Waiting for device... ${retries} retries left`)
            setTimeout(() => checkDevice(retries - 1), 1000)
          } else {
            console.error('Device never confirmed')
          }
        }

        checkDevice()
      })
      player.addListener('not_ready', () => {
        console.log('Player not ready')
        setIsReady(false)
      })

      player.addListener('player_state_changed', (data) => {
        const state = data as PlayerState | null
        if (!state) return

        const currentUri = state.track_window?.current_track?.uri
        const isPlaying = !state.paused && state.position > 0

        if (isPlaying && currentUri === currentUriRef.current) {
          onTrackReadyRef.current?.()
        }
      })

      player.addListener('playback_error', (data) => {
        console.error('Playback error:', data)
      })

      player.addListener('account_error', (data) => {
        console.error('Account error — needs Premium:', data)
      })

      player.connect()
      playerRef.current = player
    }

    if (window.Spotify) {
      initPlayer()
    } else {
      const existingScript = document.getElementById('spotify-sdk')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true
        script.id = 'spotify-sdk'
        document.body.appendChild(script)
      }
      window.onSpotifyWebPlaybackSDKReady = initPlayer
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect()
        playerRef.current = null
      }
    }
  }, [accessToken])

  const playTrack = useCallback(
    async (trackUri: string) => {
      if (!deviceId || !accessToken) return

      currentUriRef.current = trackUri
      console.log('Playing:', trackUri)

      // verify device is available before playing
      const verifyDevice = async (retries = 5): Promise<boolean> => {
        const res = await fetch(
          'https://api.spotify.com/v1/me/player/devices',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        )
        const data = (await res.json()) as {
          devices: { id: string; is_active: boolean }[]
        }
        const found = data.devices?.some((d) => d.id === deviceId)

        if (found) return true
        if (retries <= 0) return false

        console.log('Device not found yet, retrying...')
        await new Promise((r) => setTimeout(r, 800))
        return verifyDevice(retries - 1)
      }

      const deviceFound = await verifyDevice()
      if (!deviceFound) {
        console.error('Device never became available')
        return
      }

      // transfer playback to our device
      await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: false,
        }),
      })

      await new Promise((r) => setTimeout(r, 500))

      let attempts = 0

      const tryPlay = async (): Promise<void> => {
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uris: [trackUri] }),
          },
        )

        if (!response.ok && attempts < 3) {
          attempts++
          await new Promise((r) => setTimeout(r, 800))
          return tryPlay()
        }

        if (!response.ok) {
          const text = await response.text()
          console.error('Play failed:', text)
        }
      }

      await tryPlay()
    },
    [deviceId, accessToken],
  )

  const pauseTrack = useCallback(async () => {
    if (!deviceId || !accessToken) return
    currentUriRef.current = null
    await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(console.error)
  }, [deviceId, accessToken])

  return { deviceId, isReady, playTrack, pauseTrack }
}
