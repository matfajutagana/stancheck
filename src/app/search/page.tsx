import ArtistSearch from '@/components/game/ArtistSearch'
import FloatingCovers from '@/components/ui/FloatingCovers'

export default function SearchPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 1.5rem',
        overflowX: 'hidden',
        width: '100%',
        position: 'relative',
        overflowY: 'hidden',
        maxHeight: '100vh',
      }}
    >
      <FloatingCovers />

      {/* top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: '3rem',
          marginBottom: '0',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          src='/logo.svg'
          alt='Who Do You Stan'
          style={{ height: '28px', width: 'auto' }}
        />
      </div>

      {/* main content — pushed to lower third of screen */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingBottom: '0',
          paddingTop: '2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* heading */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(52px, 18vw, 80px)',
            color: 'var(--text-primary)',
            fontWeight: 900,
            lineHeight: 0.95,
            marginBottom: '12px',
            letterSpacing: '-0.02em',
          }}
        >
          Pick an
          <br />
          <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
            Artist
          </span>
        </h1>

        {/* tagline */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '15px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            marginBottom: '1.5rem',
          }}
        >
          who do you stan?
        </p>

        {/* search */}
        <ArtistSearch />

        {/* badges */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginTop: '1.25rem',
          }}
        >
          {['10 TRACKS', '15 SEC', 'FAN RANK'].map((badge, i) => (
            <span
              key={badge}
              style={{
                background: i === 1 ? 'var(--accent)' : 'var(--text-primary)',
                color: 'var(--cream)',
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
                padding: '4px 10px',
                borderRadius: '20px',
                fontWeight: 700,
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* iTunes attribution */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            marginTop: '1.5rem',
            lineHeight: 1.8,
          }}
        >
          music previews provided courtesy of iTunes
          <br />© 2026 whodoyoustan
        </p>
      </div>
    </main>
  )
}
