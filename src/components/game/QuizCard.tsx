'use client'

import type { QuizQuestion } from '@/types'
import { GAME_CONFIG } from '@/constants'

interface Props {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  timeLeft: number
  score: number
  onAnswer: (answer: string) => void
  isAnswered: boolean
  selectedAnswer: string
  isPlaying: boolean
  onPlay: () => void
  artistImage: string
}

export default function QuizCard({
  question,
  questionNumber,
  timeLeft,
  score,
  onAnswer,
  totalQuestions,
  isAnswered,
  selectedAnswer,
  isPlaying,
  onPlay,
  artistImage,
}: Props) {
  const timerPercent = (timeLeft / GAME_CONFIG.TIMER_SECONDS) * 100
  const timerColor =
    timeLeft > 8 ? 'var(--accent)' : timeLeft > 4 ? '#e67e22' : '#c0392b'

  function getButtonStyle(option: string): React.CSSProperties {
    if (!isAnswered) {
      return {
        background: '#fff',
        border: '1px solid var(--cream-border)',
        color: 'var(--text-primary)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }
    }
    if (option === question.correctAnswer) {
      return {
        background: '#f0faf0',
        border: '1.5px solid #27ae60',
        color: '#27ae60',
        boxShadow: '0 2px 8px rgba(39,174,96,0.15)',
      }
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return {
        background: '#fff8f6',
        border: '1.5px solid var(--accent)',
        color: 'var(--accent)',
        textDecoration: 'line-through',
        opacity: 0.7,
      }
    }
    return {
      background: '#fff',
      border: '1px solid var(--cream-border)',
      color: 'var(--text-muted)',
      opacity: 0.4,
      boxShadow: 'none',
    }
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
          height: '35vh',
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {question.track.album.images[0] && (
          <img
            src={question.track.album.images[0].url}
            alt='album'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.7,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, transparent 30%, var(--cream) 100%)',
          }}
        />

        {/* top bar — logo left, question counter + score right */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* logo */}
          <img
            src='/logo.svg'
            alt='StanCheck'
            style={{ height: '28px', width: 'auto' }}
          />

          {/* question counter + score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.15em',
              }}
            >
              {questionNumber} / {totalQuestions}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '20px',
                padding: '4px 10px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                {score} correct
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div
        style={{
          padding: '0 1.5rem 2rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* timer */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              TIME LEFT
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: timerColor,
                fontWeight: 700,
              }}
            >
              {timeLeft}s
            </span>
          </div>
          <div
            style={{
              height: '3px',
              background: 'var(--cream-border)',
              borderRadius: '2px',
            }}
          >
            <div
              style={{
                width: `${timerPercent}%`,
                height: '100%',
                background: timerColor,
                borderRadius: '2px',
                transition: 'width 1s linear, background 0.3s',
              }}
            />
          </div>
        </div>

        {/* now playing */}
        <div
          style={{
            background: '#fff',
            border: '0.5px solid var(--cream-border)',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* vinyl svg */}
          <svg width='36' height='36' viewBox='0 0 36 36' fill='none'>
            <circle
              cx='18'
              cy='18'
              r='17'
              fill='#1a1a1a'
              stroke='var(--cream-border)'
              strokeWidth='0.5'
            />
            <circle cx='18' cy='18' r='11' fill='#222' />
            <circle cx='18' cy='18' r='7' fill='#1a1a1a' />
            <circle cx='18' cy='18' r='3' fill='var(--accent)' />
            <circle cx='18' cy='18' r='1.2' fill='#111' />
          </svg>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.15em',
                marginBottom: '2px',
                fontWeight: 600,
              }}
            >
              NOW PLAYING
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '14px',
                color: isAnswered
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
                fontStyle: 'italic',
                fontWeight: isAnswered ? 700 : 400,
              }}
            >
              {isAnswered ? question.correctAnswer : 'Guess the song...'}
            </p>
          </div>
          {/* sound waves */}
          {isPlaying && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {[8, 14, 10, 6, 12].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: '2px',
                    height: `${h}px`,
                    background: 'var(--accent)',
                    borderRadius: '1px',
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* play button */}
        {!isPlaying && !isAnswered && (
          <button
            onClick={onPlay}
            style={{
              width: '100%',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            ▶ Play Track
          </button>
        )}

        {/* choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {question.options.map((option, i) => (
            <button
              key={option}
              onClick={() => !isAnswered && isPlaying && onAnswer(option)}
              disabled={isAnswered || !isPlaying}
              style={{
                width: '100%',
                padding: '16px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: isAnswered || !isPlaying ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                ...getButtonStyle(option),
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: '#fff',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 700,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                {option}
              </span>
            </button>
          ))}
        </div>

        {!isPlaying && !isAnswered && (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}
          >
            press play to start the timer
          </p>
        )}
      </div>
    </main>
  )
}
