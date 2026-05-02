import Link from 'next/link'
import FloatingCovers from '@/components/ui/FloatingCovers'

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        overflowX: 'hidden',
      }}
    >
      <FloatingCovers />
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.2em',
            marginBottom: '1.5rem',
          }}
        >
          WHODOYOUSTAN
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(42px, 11vw, 64px)',
            color: 'var(--text-primary)',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: '12px',
            wordBreak: 'break-word',
          }}
        >
          Who do you{' '}
          <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
            stan?
          </span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
          }}
        >
          pick your artist · guess the songs · get your fan rank
        </p>

        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {['10 TRACKS', '15 SEC', 'FAN RANK'].map((badge, i) => (
            <span
              key={badge}
              style={{
                background: i === 1 ? 'var(--accent)' : 'var(--text-primary)',
                color: 'var(--cream)',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
                padding: '5px 12px',
                borderRadius: '20px',
                fontWeight: 700,
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        <Link
          href='/search'
          style={{
            display: 'block',
            width: '100%',
            background: 'var(--text-primary)',
            color: 'var(--cream)',
            padding: '15px',
            textAlign: 'center',
            borderRadius: '12px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '0.03em',
            textDecoration: 'none',
            marginBottom: '12px',
          }}
        >
          Start Playing →
        </Link>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          powered by deezer · no account needed
        </p>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: '4px',
          }}
        >
          © 2026 raymart fajutagana
        </p>
      </div>
    </main>
  )
}
