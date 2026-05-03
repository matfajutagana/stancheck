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
    if (score >= 9) return `you really know your ${artistName}`
    if (score >= 7) return `solid ${artistName} fan`
    if (score >= 4) return `casual ${artistName} listener`
    return `do you even listen to ${artistName}?`
  }

  const accentColor = () => {
    if (score >= 9) return '#c0392b'
    if (score >= 7) return '#e67e22'
    if (score >= 4) return '#2980b9'
    return '#7f8c8d'
  }

  const color = accentColor()

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
          height: '28vh',
          background: '#1a1a1a',
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
              opacity: 0.75,
            }}
          />
        )}
        {/* color tint overlay based on rank */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${color}33 0%, transparent 60%)`,
          }}
        />
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
              fontSize: '9px',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.25em',
              marginBottom: '3px',
              textTransform: 'uppercase',
            }}
          >
            Fan Report
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              color: '#fff',
              fontWeight: 900,
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            {artistName}
          </p>
        </div>
      </div>

      {/* content */}
      <div
        style={{
          padding: '0.75rem 1.25rem 1.5rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* rank title + message */}
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(26px, 7vw, 38px)',
              color: 'var(--text-primary)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: '5px',
              letterSpacing: '-0.02em',
            }}
          >
            {rank.title.replace(/\p{Emoji}/gu, '').trim()}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: color,
              fontWeight: 500,
              letterSpacing: '0.01em',
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
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          }}
        >
          {/* big score number */}
          <div
            style={{
              padding: '16px 18px 12px',
              borderBottom: '0.5px solid var(--cream-border)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.2em',
                  marginBottom: '2px',
                }}
              >
                YOUR SCORE
              </p>
              <div
                style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '42px',
                    fontWeight: 900,
                    color: color,
                    lineHeight: 1,
                  }}
                >
                  {score}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    marginBottom: '4px',
                  }}
                >
                  / {total}
                </span>
              </div>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '28px',
                fontWeight: 900,
                color: 'var(--cream-border)',
                letterSpacing: '-0.02em',
              }}
            >
              {percentage}%
            </div>
          </div>

          {/* track-by-track breakdown */}
          <div style={{ padding: '12px 18px 14px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--text-muted)',
                letterSpacing: '0.2em',
                marginBottom: '10px',
              }}
            >
              TRACK BY TRACK
            </p>
            <div
              style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}
            >
              {gameState.answers.map((answer, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {/* bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '32px',
                      borderRadius: '4px',
                      background: answer.isCorrect
                        ? color
                        : 'var(--cream-border)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {answer.isCorrect && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                        }}
                      />
                    )}
                  </div>
                  {/* track number */}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '8px',
                      color: answer.isCorrect ? color : 'var(--text-muted)',
                      fontWeight: answer.isCorrect ? 700 : 400,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
              padding: '15px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '14px',
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
              padding: '13px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: '13px',
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
