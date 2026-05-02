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
        padding: '2rem 1.5rem',
        overflowX: 'hidden',
        width: '100%',
      }}
    >
      {/* logo */}
      <div style={{ marginBottom: '1.5rem' }}>
        <img
          src='/logo.svg'
          alt='Who Do You Stan'
          style={{ height: '40px', width: 'auto' }}
        />
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          minWidth: 0, // ← prevents flex children from overflowing
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
          SEARCH
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(48px, 15vw, 72px)',
            color: 'var(--text-primary)',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '8px',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
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
