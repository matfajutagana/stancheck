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
      {/* hero */}
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
        <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
          <img
            src='/logo.svg'
            alt='StanCheck'
            style={{ height: '28px', width: 'auto' }}
          />
        </div>
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
