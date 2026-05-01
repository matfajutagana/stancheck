'use client'

import { useRouter } from 'next/navigation'
import type { GameState } from '@/types'
import { FAN_RANKS } from '@/constants'

interface Props {
  gameState: GameState
}

export default function ResultCard({ gameState }: Props) {
  const router = useRouter()
  const { score, questions } = gameState
  const total = questions.length

  const rank =
    FAN_RANKS.find((r) => score >= r.minScore) ??
    FAN_RANKS[FAN_RANKS.length - 1]
  const percentage = Math.round((score / total) * 100)

  return (
    <main className='min-h-screen bg-black flex flex-col items-center justify-center px-4'>
      <div className='max-w-md w-full text-center space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-5xl font-bold text-white'>{rank.title}</h1>
          <p className='text-zinc-400'>{rank.description}</p>
        </div>

        <div className='bg-zinc-900 border border-zinc-700 rounded-2xl p-8 space-y-4'>
          <div className='text-6xl font-bold text-green-400'>
            {score}
            <span className='text-zinc-600 text-3xl'>/{total}</span>
          </div>
          <p className='text-zinc-400'>{percentage}% correct</p>
        </div>

        <div className='space-y-3'>
          <button
            onClick={() => router.push('/search')}
            className='w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-4 rounded-full transition-all'
          >
            Try another artist
          </button>
          <button
            onClick={() => router.push('/')}
            className='w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-4 rounded-full transition-all'
          >
            Back to home
          </button>
        </div>
      </div>
    </main>
  )
}
