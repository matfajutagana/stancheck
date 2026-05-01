'use client'

import { useEffect } from 'react'
import type { QuizQuestion } from '@/types'
import { GAME_CONFIG } from '@/constants'

interface Props {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  timeLeft: number
  score: number
  onAnswer: (answer: string) => void
  onStart: () => void
}

export default function QuizCard({
  question,
  questionNumber,
  timeLeft,
  score,
  onAnswer,
  onStart,
  totalQuestions,
}: Props) {
  useEffect(() => {
    onStart()
  }, [question])

  const timerPercent = (timeLeft / GAME_CONFIG.TIMER_SECONDS) * 100
  const timerColor =
    timeLeft > 8
      ? 'bg-green-400'
      : timeLeft > 4
        ? 'bg-yellow-400'
        : 'bg-red-400'

  return (
    <main className='min-h-screen bg-black flex flex-col items-center justify-center px-4'>
      <div className='max-w-md w-full space-y-6'>
        <div className='flex justify-between items-center text-sm text-zinc-500'>
          <span>
            Question {questionNumber}/{totalQuestions}
          </span>
          <span className='text-green-400 font-medium'>{score} correct</span>
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-zinc-400'>Time left</span>
            <span className={timeLeft <= 4 ? 'text-red-400' : 'text-zinc-400'}>
              {timeLeft}s
            </span>
          </div>
          <div className='h-2 bg-zinc-800 rounded-full overflow-hidden'>
            <div
              className={`h-full ${timerColor} transition-all duration-1000`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>

        <div className='bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-center space-y-3'>
          <p className='text-zinc-400 text-sm'>Now playing...</p>
          <div className='w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto'>
            <div className='w-4 h-4 bg-green-400 rounded-full animate-pulse' />
          </div>
          <p className='text-zinc-500 text-xs'>Guess the song!</p>
        </div>

        <div className='grid grid-cols-1 gap-3'>
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => onAnswer(option)}
              className='w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-green-400 text-white font-medium py-4 px-6 rounded-xl text-left transition-all duration-150 active:scale-98'
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
