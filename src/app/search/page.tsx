import ArtistSearch from '@/components/game/ArtistSearch'

export default function SearchPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem 2rem',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.2em',
            marginBottom: '1.5rem',
          }}
        >
          SEARCH
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(90px, 13vw, 72px)',
            color: 'var(--text-primary)',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: '8px',
          }}
        >
          Pick an{' '}
          <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
            Artist
          </span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '16px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            marginBottom: '2rem',
          }}
        >
          who do you stan?
        </p>
        <ArtistSearch />
      </div>
    </main>
  )
}
