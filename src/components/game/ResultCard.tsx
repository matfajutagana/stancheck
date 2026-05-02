'use client'

import { useRouter } from 'next/navigation'
import type { GameState } from '@/types'
import { FAN_RANKS } from '@/constants'

interface Props {
  gameState: GameState
}

export default function ResultCard({ gameState }: Props) {
  const router = useRouter()
  const { score, questions, artistName, artistImage } = gameState
  const total = questions.length
  const rank =
    FAN_RANKS.find((r) => score >= r.minScore) ??
    FAN_RANKS[FAN_RANKS.length - 1]
  const percentage = Math.round((score / total) * 100)

  const rankMessage = () => {
    if (score >= 9) return `you really know your ${artistName} 🔥`
    if (score >= 7) return `solid ${artistName} fan`
    if (score >= 4) return `casual ${artistName} listener`
    return `do you even listen to ${artistName}? 💀`
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* artist image hero */}
      <div
        style={{
          position: 'relative',
          height: '40vh',
          background: '#2a2a2a',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {artistImage && (
          <img
            src={artistImage}
            alt={artistName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              opacity: 0.85,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, transparent 20%, var(--cream) 100%)',
          }}
        />

        {/* artist name overlay */}
        <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.2em',
              marginBottom: '4px',
            }}
          >
            FAN REPORT
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              color: '#fff',
              fontWeight: 900,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {artistName}
          </p>
        </div>
      </div>

      {/* content */}
      <div
        style={{
          padding: '1rem 1.5rem 2rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* rank */}
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(36px, 9vw, 52px)',
              color: 'var(--text-primary)',
              fontWeight: 900,
              lineHeight: 1,
              marginBottom: '6px',
            }}
          >
            {rank.title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '15px',
              color: 'var(--accent)',
              fontStyle: 'italic',
            }}
          >
            {rankMessage()}
          </p>
        </div>

        {/* score card */}
        <div
          style={{
            background: '#fff',
            border: '0.5px solid var(--cream-border)',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
              }}
            >
              YOUR SCORE
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent)',
                fontWeight: 700,
              }}
            >
              {percentage}%
            </span>
          </div>

          {/* progress bar */}
          <div
            style={{
              height: '6px',
              background: 'var(--cream-border)',
              borderRadius: '3px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                width: `${percentage}%`,
                height: '100%',
                background: 'var(--accent)',
                borderRadius: '3px',
                transition: 'width 0.8s ease',
              }}
            />
          </div>

          {/* track breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gap: '4px',
            }}
          >
            {gameState.answers.map((answer, i) => (
              <div
                key={i}
                style={{
                  height: '22px',
                  borderRadius: '4px',
                  background: answer.isCorrect
                    ? 'var(--accent)'
                    : 'var(--cream-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {answer.isCorrect ? (
                  <svg width='8' height='8' viewBox='0 0 8 8' fill='none'>
                    <path
                      d='M1.5 4l2 2 3-3'
                      stroke='#fff'
                      strokeWidth='1.2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                ) : (
                  <svg width='8' height='8' viewBox='0 0 8 8' fill='none'>
                    <path
                      d='M2 2l4 4M6 2l-4 4'
                      stroke='#fff'
                      strokeWidth='1.2'
                      strokeLinecap='round'
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* share row */}
        <button
          onClick={async () => {
            if (navigator.share) {
              await navigator.share({
                title: 'Who do you Stan?',
                text: `I got "${rank.title}" on the ${artistName} quiz! ${rankMessage()} — stancheck-mat.vercel.app`,
                url: 'https://stancheck-mat.vercel.app',
              })
            } else {
              await navigator.clipboard.writeText(
                `I got "${rank.title}" on the ${artistName} StanCheck! stancheck-mat.vercel.app`,
              )
              alert('Copied to clipboard!')
            }
          }}
          style={{
            width: '100%',
            background: '#fff',
            border: '0.5px solid var(--cream-border)',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
            <circle cx='14' cy='4' r='2.5' fill='var(--accent)' />
            <circle cx='4' cy='9' r='2.5' fill='var(--accent)' />
            <circle cx='14' cy='14' r='2.5' fill='var(--accent)' />
            <path
              d='M6.5 8l5-3M6.5 10l5 3'
              stroke='var(--accent)'
              strokeWidth='1.2'
              strokeLinecap='round'
            />
          </svg>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              margin: 0,
            }}
          >
            Share your result
          </p>
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--accent)',
              fontWeight: 700,
            }}
          >
            →
          </span>
        </button>

        {/* buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: 'auto',
          }}
        >
          <button
            onClick={() => router.push('/search')}
            style={{
              width: '100%',
              background: 'var(--text-primary)',
              color: 'var(--cream)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Try Another Artist →
          </button>
          <button
            onClick={() => router.push('/')}
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '0.5px solid var(--cream-border)',
              borderRadius: '12px',
              padding: '14px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  )
}
