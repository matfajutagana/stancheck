'use client'

import { useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { GameState } from '@/types'
import { FAN_RANKS } from '@/constants'

interface Props {
  gameState: GameState
}

export default function ResultCard({ gameState }: Props) {
  const router = useRouter()
  const storyCardRef = useRef<HTMLDivElement>(null)
  const { score, questions, artistName, artistImage } = gameState
  const total = questions.length
  const rank =
    FAN_RANKS.find((r) => score >= r.minScore) ??
    FAN_RANKS[FAN_RANKS.length - 1]
  const percentage = Math.round((score / total) * 100)
  const isCertified = score === total

  const rankMessage = () => {
    if (score >= 9) return `you really know your ${artistName}`
    if (score >= 7) return `solid ${artistName} fan`
    if (score >= 4) return `casual ${artistName} listener`
    return `do you even listen to ${artistName}?`
  }

  const saveImage = useCallback(async () => {
    if (!storyCardRef.current) return
    try {
      const el = storyCardRef.current
      el.style.display = 'flex'
      await new Promise((r) => setTimeout(r, 150))

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(el, {
        backgroundColor: '#f0ebe2',
        scale: 3,
        useCORS: false,
        allowTaint: false,
        logging: false,
      })

      el.style.display = 'none'

      const link = document.createElement('a')
      link.download = `${artistName.replace(/\s+/g, '-').toLowerCase()}-stancheck.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Save failed:', err)
      if (storyCardRef.current) storyCardRef.current.style.display = 'none'
    }
  }, [artistName])

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
          padding: '0.5rem 1.25rem 1.5rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* rank */}
        <div style={{ position: 'relative' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(26px, 7vw, 38px)',
              color: 'var(--text-primary)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: '4px',
              letterSpacing: '-0.02em',
            }}
          >
            {rank.title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
            }}
          >
            {rankMessage()}
          </p>

          {/* certified stan stamp */}
          {isCertified && (
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                right: '0',
                transform: 'rotate(12deg)',
                pointerEvents: 'none',
              }}
            >
              <svg width='90' height='90' viewBox='0 0 90 90'>
                {/* outer ring */}
                <circle
                  cx='45'
                  cy='45'
                  r='42'
                  fill='none'
                  stroke='#c0392b'
                  strokeWidth='3'
                  strokeDasharray='4 2'
                  opacity='0.9'
                />
                {/* inner ring */}
                <circle
                  cx='45'
                  cy='45'
                  r='36'
                  fill='none'
                  stroke='#c0392b'
                  strokeWidth='1.5'
                  opacity='0.9'
                />
                {/* top text arc */}
                <path id='topArc' d='M 10,45 A 35,35 0 0,1 80,45' fill='none' />
                <text
                  fontFamily='Courier New, monospace'
                  fontSize='8'
                  fontWeight='700'
                  fill='#c0392b'
                  letterSpacing='3'
                >
                  <textPath href='#topArc' startOffset='10%'>
                    CERTIFIED STAN
                  </textPath>
                </text>
                {/* bottom text arc */}
                <path
                  id='bottomArc'
                  d='M 80,45 A 35,35 0 0,1 10,45'
                  fill='none'
                />
                <text
                  fontFamily='Courier New, monospace'
                  fontSize='7'
                  fontWeight='700'
                  fill='#c0392b'
                  letterSpacing='2'
                >
                  <textPath href='#bottomArc' startOffset='15%'>
                    WHODOYOUSTAN.COM
                  </textPath>
                </text>
                {/* center star */}
                <text
                  x='45'
                  y='50'
                  textAnchor='middle'
                  fontSize='18'
                  fill='#c0392b'
                  opacity='0.9'
                >
                  ★
                </text>
              </svg>
            </div>
          )}
        </div>

        {/* horizontal cassette */}
        <div
          style={{
            background: '#1a1a1a',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          }}
        >
          <div
            style={{
              background: '#222',
              borderRadius: '8px',
              border: '1px solid #333',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 10px 0',
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '4px',
                    background: '#111',
                    borderRadius: '0 0 3px 3px',
                  }}
                />
              ))}
            </div>
            <div
              style={{
                margin: '6px 10px',
                background: '#f0ebe2',
                borderRadius: '4px',
                padding: '12px 10px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {artistName}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: '#666',
                  textAlign: 'center',
                  letterSpacing: '0.15em',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                }}
              >
                {rank.title} · {score}/{total}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  gap: '8px',
                }}
              >
                <Reel size={56} />
                <div
                  style={{
                    flex: 1,
                    height: '28px',
                    background: '#ddd',
                    borderRadius: '3px',
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                  }}
                >
                  {[10, 16, 12, 18, 10, 14, 8].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: '2px',
                        height: `${h}px`,
                        background: '#999',
                        borderRadius: '1px',
                      }}
                    />
                  ))}
                </div>
                <Reel size={56} />
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                {gameState.answers.map((answer, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '8px',
                        color: '#999',
                        width: '14px',
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: answer.isCorrect ? '#1a1a1a' : '#bbb',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textDecoration: answer.isCorrect
                          ? 'none'
                          : 'line-through',
                        fontWeight: answer.isCorrect ? 600 : 400,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {questions[i]?.correctAnswer?.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '8px',
                        color: '#1a1a1a',
                        flexShrink: 0,
                      }}
                    >
                      {answer.isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: '10px',
                  paddingTop: '8px',
                  borderTop: '0.5px solid #ccc',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '7px',
                    color: '#999',
                    letterSpacing: '0.1em',
                  }}
                >
                  WHODOYOUSTAN.COM
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '7px',
                    color: '#999',
                    letterSpacing: '0.1em',
                  }}
                >
                  {percentage}% · {new Date().getFullYear()}
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 10px 6px',
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '4px',
                    background: '#111',
                    borderRadius: '3px 3px 0 0',
                  }}
                />
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
            paddingTop: '4px',
          }}
        >
          <button
            onClick={saveImage}
            style={{
              width: '100%',
              background: '#fff',
              color: 'var(--text-primary)',
              border: '1px solid var(--cream-border)',
              borderRadius: '12px',
              padding: '14px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path
                  d='M8 2v8M5 7l3 3 3-3'
                  stroke='var(--text-primary)'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M2 12h12'
                  stroke='var(--text-primary)'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </svg>
              Save Tape
            </span>
          </button>
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

      {/* hidden vertical story card */}
      <div
        ref={storyCardRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '360px',
          background: '#f0ebe2',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 20px',
        }}
      >
        <div
          style={{
            width: '100%',
            background: '#1a1a1a',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              background: '#222',
              borderRadius: '10px',
              border: '1px solid #333',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 14px 0',
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '10px',
                    height: '5px',
                    background: '#111',
                    borderRadius: '0 0 3px 3px',
                  }}
                />
              ))}
            </div>

            <div
              style={{
                margin: '8px 12px',
                background: '#f0ebe2',
                borderRadius: '6px',
                padding: '16px 14px',
                position: 'relative',
              }}
            >
              {/* reels */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  gap: '12px',
                }}
              >
                <Reel size={80} />
                <div
                  style={{
                    flex: 1,
                    height: '32px',
                    background: '#ddd',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                  }}
                >
                  {[12, 18, 14, 22, 12, 18, 10, 14].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: '2px',
                        height: `${h}px`,
                        background: '#999',
                        borderRadius: '1px',
                      }}
                    />
                  ))}
                </div>
                <Reel size={80} />
              </div>

              <div
                style={{ borderTop: '0.5px solid #ddd', marginBottom: '12px' }}
              />

              {/* artist + rank with stamp */}
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <p
                  style={{
                    fontFamily: 'Lucida Console, Courier New, monospace',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    letterSpacing: '0.15em',
                    marginBottom: '3px',
                    textTransform: 'uppercase',
                  }}
                >
                  {artistName}
                </p>
                <p
                  style={{
                    fontFamily: 'Lucida Console, Courier New, monospace',
                    fontSize: '11px',
                    color: '#555',
                    letterSpacing: '0.12em',
                    marginBottom: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  {rank.title}
                </p>
                <p
                  style={{
                    fontFamily: 'Lucida Console, Courier New, monospace',
                    fontSize: '11px',
                    color: '#888',
                    letterSpacing: '0.08em',
                  }}
                >
                  {score}/{total} · {percentage}%
                </p>

                {/* stamp on saved card */}
                {isCertified && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-5px',
                      transform: 'rotate(15deg)',
                      opacity: 0.85,
                    }}
                  >
                    <svg width='80' height='80' viewBox='0 0 80 80'>
                      <circle
                        cx='40'
                        cy='40'
                        r='37'
                        fill='none'
                        stroke='#c0392b'
                        strokeWidth='3'
                        strokeDasharray='4 2'
                      />
                      <circle
                        cx='40'
                        cy='40'
                        r='31'
                        fill='none'
                        stroke='#c0392b'
                        strokeWidth='1.5'
                      />
                      <path
                        id='topArcStory'
                        d='M 8,40 A 32,32 0 0,1 72,40'
                        fill='none'
                      />
                      <text
                        fontFamily='Courier New, monospace'
                        fontSize='7.5'
                        fontWeight='700'
                        fill='#c0392b'
                        letterSpacing='2.5'
                      >
                        <textPath href='#topArcStory' startOffset='8%'>
                          CERTIFIED STAN
                        </textPath>
                      </text>
                      <path
                        id='bottomArcStory'
                        d='M 72,40 A 32,32 0 0,1 8,40'
                        fill='none'
                      />
                      <text
                        fontFamily='Courier New, monospace'
                        fontSize='6.5'
                        fontWeight='700'
                        fill='#c0392b'
                        letterSpacing='1.5'
                      >
                        <textPath href='#bottomArcStory' startOffset='12%'>
                          WHODOYOUSTAN.COM
                        </textPath>
                      </text>
                      <text
                        x='40'
                        y='45'
                        textAnchor='middle'
                        fontSize='16'
                        fill='#c0392b'
                      >
                        ★
                      </text>
                    </svg>
                  </div>
                )}
              </div>

              <div
                style={{ borderTop: '0.5px solid #ddd', marginBottom: '10px' }}
              />

              {/* tracklist */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '7px',
                  marginBottom: '14px',
                }}
              >
                {gameState.answers.map((answer, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Lucida Console, Courier New, monospace',
                        fontSize: '10px',
                        color: '#bbb',
                        width: '18px',
                        flexShrink: 0,
                        paddingTop: '1px',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Lucida Console, Courier New, monospace',
                        fontSize: '11px',
                        color: answer.isCorrect ? '#1a1a1a' : '#bbb',
                        fontWeight: answer.isCorrect ? 700 : 400,
                        letterSpacing: '0.02em',
                        flex: 1,
                        lineHeight: '1.4',
                        wordBreak: 'break-word',
                      }}
                    >
                      {questions[i]?.correctAnswer?.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Lucida Console, Courier New, monospace',
                        fontSize: '12px',
                        color: '#1a1a1a',
                        flexShrink: 0,
                        paddingTop: '1px',
                      }}
                    >
                      {answer.isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: '0.5px solid #ccc',
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Lucida Console, Courier New, monospace',
                    fontSize: '9px',
                    color: '#555',
                    letterSpacing: '0.1em',
                  }}
                >
                  WHODOYOUSTAN.COM
                </span>
                <span
                  style={{
                    fontFamily: 'Lucida Console, Courier New, monospace',
                    fontSize: '9px',
                    color: '#555',
                    letterSpacing: '0.08em',
                  }}
                >
                  {new Date().getFullYear()}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 14px 8px',
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '10px',
                    height: '5px',
                    background: '#111',
                    borderRadius: '3px 3px 0 0',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function Reel({ size = 56 }: { size?: number }) {
  const cx = size / 2
  const cy = size / 2
  const outerR = size * 0.39
  const innerR = size * 0.21
  const spokes = 6

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill='#ccc'
        stroke='#bbb'
        strokeWidth='1'
      />
      <circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill='#aaa'
        stroke='#999'
        strokeWidth='1'
      />
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = (i / spokes) * Math.PI * 2
        const x1 = cx + Math.cos(angle) * (innerR + 1)
        const y1 = cy + Math.sin(angle) * (innerR + 1)
        const x2 = cx + Math.cos(angle) * (outerR - 1)
        const y2 = cy + Math.sin(angle) * (outerR - 1)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke='#999'
            strokeWidth='1.5'
          />
        )
      })}
      <circle cx={cx} cy={cy} r={size * 0.07} fill='#888' />
      <circle cx={cx} cy={cy} r={size * 0.035} fill='#666' />
    </svg>
  )
}
