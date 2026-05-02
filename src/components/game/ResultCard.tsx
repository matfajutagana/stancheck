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

  return (
    <main className='min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 relative overflow-hidden'>
      <div
        className='absolute inset-0 opacity-3'
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, #333 28px, #333 29px)`,
        }}
      />

      <div className='max-w-sm w-full text-center space-y-6 relative z-10'>
        <p className='font-mono text-xs text-zinc-600 tracking-widest'>
          ◆ RESULTS ◆
        </p>

        {/* artist image + name */}
        {artistImage && (
          <div className='flex items-center justify-center gap-3'>
            <img
              src={artistImage}
              alt={artistName}
              className='w-12 h-12 grayscale object-cover'
            />
            <p
              className='text-zinc-400 text-sm'
              style={{ fontFamily: 'var(--font-special-elite)' }}
            >
              {artistName}
            </p>
          </div>
        )}

        {/* rank */}
        <div className='relative tape border-2 border-[#e8e0d0] p-8 space-y-4 bg-[#0f0f0f]'>
          <h1
            className='text-5xl text-[#ff3e3e] flicker'
            style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
          >
            {rank.title}
          </h1>

          {/* certified fan line with artist name */}
          <p
            className='text-[#c8b89a] text-sm'
            style={{ fontFamily: 'var(--font-special-elite)' }}
          >
            {score >= 9
              ? `certified ${artistName} stan 🔥`
              : score >= 7
                ? `real ${artistName} fan`
                : score >= 4
                  ? `casual ${artistName} listener`
                  : `who even is ${artistName}? 💀`}
          </p>

          <div className='border-t border-zinc-800 pt-4 space-y-1'>
            <div
              className='text-6xl text-white'
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              {score}
              <span className='text-zinc-600 text-3xl'>/{total}</span>
            </div>
            <p className='font-mono text-xs text-zinc-500'>
              {percentage}% CORRECT
            </p>
          </div>
        </div>

        {/* answer breakdown */}
        <div className='flex justify-center gap-1'>
          {gameState.answers.map((answer, i) => (
            <div
              key={i}
              className={`w-6 h-6 border flex items-center justify-center text-xs font-mono ${
                answer.isCorrect
                  ? 'bg-[#1a3a1a] border-[#4ade80] text-[#4ade80]'
                  : 'bg-transparent border-zinc-700 text-zinc-700'
              }`}
            >
              {answer.isCorrect ? '✓' : '✗'}
            </div>
          ))}
        </div>

        {/* buttons */}
        <div className='space-y-3'>
          <div className='relative'>
            <div className='absolute inset-0 bg-[#ff3e3e] translate-x-1 translate-y-1' />
            <button
              onClick={() => router.push('/search')}
              className='relative w-full bg-[#e8e0d0] text-[#0a0a0a] font-bold py-4 text-xl transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1'
              style={{
                fontFamily: 'var(--font-bebas)',
                letterSpacing: '0.1em',
              }}
            >
              TRY ANOTHER ARTIST
            </button>
          </div>

          <button
            onClick={() => router.push('/')}
            className='w-full border-2 border-zinc-700 text-zinc-500 py-3 font-mono text-sm hover:border-zinc-500 hover:text-zinc-400 transition-all'
          >
            back to home
          </button>
        </div>
      </div>
    </main>
  )
}
