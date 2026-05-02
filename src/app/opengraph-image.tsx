import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Who Do You Stan? — Guess the Song Music Quiz'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#f5efe6',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif',
        padding: '60px',
      }}
    >
      <p
        style={{
          fontSize: '18px',
          color: '#bbbbbb',
          letterSpacing: '0.2em',
          marginBottom: '24px',
          fontFamily: 'monospace',
        }}
      >
        WHODOYOUSTAN.COM
      </p>
      <h1
        style={{
          fontSize: '96px',
          fontWeight: 900,
          color: '#1a1a1a',
          lineHeight: 1,
          marginBottom: '16px',
          textAlign: 'center',
          margin: '0 0 16px 0',
        }}
      >
        Who do you{' '}
        <span style={{ color: '#c0392b', fontStyle: 'italic' }}>stan?</span>
      </h1>
      <p
        style={{
          fontSize: '28px',
          color: '#888888',
          fontStyle: 'italic',
          margin: '0 0 48px 0',
        }}
      >
        pick your artist · guess the songs · get your fan rank
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        {['10 TRACKS', '15 SEC', 'FAN RANK'].map((badge, i) => (
          <span
            key={badge}
            style={{
              background: i === 1 ? '#c0392b' : '#1a1a1a',
              color: '#f5efe6',
              fontSize: '18px',
              padding: '8px 20px',
              borderRadius: '20px',
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
            }}
          >
            {badge}
          </span>
        ))}
      </div>
    </div>,
    { ...size },
  )
}
