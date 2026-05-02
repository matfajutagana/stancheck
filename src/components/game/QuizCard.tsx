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
}: Props) {
  const timerPercent = (timeLeft / GAME_CONFIG.TIMER_SECONDS) * 100
  const timerColor =
    timeLeft > 8 ? '#ff3e3e' : timeLeft > 4 ? '#ffaa00' : '#ff0000'

  function getButtonStyle(option: string) {
    if (!isAnswered) {
      return 'bg-[#0a0a0a] border-[#e8e0d0] text-[#e8e0d0] hover:bg-[#1a1a1a] hover:border-[#ff3e3e]'
    }
    if (option === question.correctAnswer) {
      return 'bg-[#1a3a1a] border-[#4ade80] text-[#4ade80] font-bold'
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return 'bg-[#3a1a1a] border-[#ff3e3e] text-[#ff3e3e] line-through'
    }
    return 'bg-[#0a0a0a] border-zinc-800 text-zinc-600'
  }

  return (
    <main className='min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 relative overflow-hidden'>
      {/* background lines */}
      <div
        className='absolute inset-0 opacity-3'
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, #333 28px, #333 29px)`,
        }}
      />

      <div className='max-w-sm w-full space-y-5 relative z-10'>
        {/* header */}
        <div className='flex justify-between items-center'>
          <span className='font-mono text-xs text-zinc-500'>
            TRACK {questionNumber}/{totalQuestions}
          </span>
          <span
            className='text-[#ff3e3e] text-lg'
            style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.1em' }}
          >
            {score} CORRECT
          </span>
        </div>

        {/* timer bar */}
        <div className='space-y-1'>
          <div className='flex justify-between text-xs font-mono text-zinc-600'>
            <span>TIME</span>
            <span style={{ color: timerColor }}>{timeLeft}s</span>
          </div>
          <div className='h-2 bg-zinc-900 border border-zinc-800'>
            <div
              className='h-full transition-all duration-1000'
              style={{ width: `${timerPercent}%`, background: timerColor }}
            />
          </div>
        </div>

        {/* now playing card */}
        <div className='relative tape border-2 border-[#e8e0d0] p-6 text-center space-y-4 bg-[#0f0f0f]'>
          <p className='font-mono text-xs text-zinc-500 tracking-widest'>
            ◆ NOW PLAYING ◆
          </p>

          {!isPlaying ? (
            <div className='space-y-3'>
              <div className='w-16 h-16 border-2 border-zinc-700 rounded-full flex items-center justify-center mx-auto'>
                <div className='w-3 h-3 rounded-full bg-zinc-700' />
              </div>
              <div className='relative'>
                <div className='absolute inset-0 bg-[#ff3e3e] translate-x-1 translate-y-1' />
                <button
                  onClick={onPlay}
                  className='relative w-full bg-[#e8e0d0] text-[#0a0a0a] font-bold py-3 text-xl transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1'
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    letterSpacing: '0.1em',
                  }}
                >
                  ▶ PLAY TRACK
                </button>
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              <div className='w-16 h-16 border-2 border-[#ff3e3e] rounded-full flex items-center justify-center mx-auto'>
                <div className='w-4 h-4 rounded-full bg-[#ff3e3e] animate-pulse' />
              </div>
              {isAnswered && (
                <p
                  className='text-[#ff3e3e] text-lg'
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {question.correctAnswer}
                </p>
              )}
              {!isAnswered && (
                <p className='text-zinc-600 text-xs font-mono animate-pulse'>
                  ● PLAYING... GUESS THE TRACK
                </p>
              )}
            </div>
          )}
        </div>

        {/* choices */}
        <div className='space-y-2'>
          {question.options.map((option, i) => (
            <button
              key={option}
              onClick={() => !isAnswered && isPlaying && onAnswer(option)}
              disabled={isAnswered || !isPlaying}
              className={`w-full border-2 py-3 px-4 text-left transition-all duration-150 flex items-center gap-3 ${getButtonStyle(option)}`}
            >
              <span className='font-mono text-xs opacity-50 w-4'>
                {String.fromCharCode(65 + i)}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-special-elite)',
                  fontSize: '0.9rem',
                }}
              >
                {option}
              </span>
            </button>
          ))}
        </div>

        {!isPlaying && (
          <p className='text-center text-zinc-700 text-xs font-mono'>
            // press play to start the timer
          </p>
        )}
      </div>
    </main>
  )
}
