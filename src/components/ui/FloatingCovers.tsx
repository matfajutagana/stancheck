'use client'

import { useEffect, useState } from 'react'

interface Cover {
  id: string
  url: string
}

const POSITIONS = [
  { left: '4%', delay: '0s', duration: '14s', size: 70, rot: -8 },
  { left: '14%', delay: '-5s', duration: '18s', size: 85, rot: 5 },
  { left: '24%', delay: '-8s', duration: '12s', size: 65, rot: -3 },
  { left: '34%', delay: '-2s', duration: '16s', size: 78, rot: 10 },
  { left: '44%', delay: '-10s', duration: '20s', size: 72, rot: -12 },
  { left: '54%', delay: '-4s', duration: '15s', size: 60, rot: 7 },
  { left: '64%', delay: '-7s', duration: '17s', size: 82, rot: -5 },
  { left: '74%', delay: '-3s', duration: '13s', size: 68, rot: 9 },
  { left: '84%', delay: '-12s', duration: '19s', size: 75, rot: -10 },
  { left: '92%', delay: '-6s', duration: '11s', size: 62, rot: 4 },
]

export default function FloatingCovers() {
  const [covers, setCovers] = useState<Cover[]>([])

  useEffect(() => {
    async function fetchCovers() {
      try {
        const res = await fetch('/api/deezer/chart')
        const data = (await res.json()) as { covers: Cover[] }
        setCovers(data.covers ?? [])
      } catch (e) {
        console.error(e)
      }
    }
    fetchCovers()
  }, [])

  if (covers.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {POSITIONS.map((pos, i) => {
        const cover = covers[i % covers.length]
        if (!cover) return null
        return (
          <div
            key={cover.id + i}
            style={{
              position: 'absolute',
              bottom: '-120px',
              left: pos.left,
              width: `${pos.size}px`,
              height: `${pos.size}px`,
              borderRadius: '8px',
              overflow: 'hidden',
              opacity: 0,
              animation: `floatCover ${pos.duration} linear infinite`,
              animationDelay: pos.delay,
              transform: `rotate(${pos.rot}deg)`,
            }}
          >
            <img
              src={cover.url}
              alt=''
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )
      })}
    </div>
  )
}
