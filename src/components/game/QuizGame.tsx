'use client'

import { useGame } from '@/hooks/useGame'
import { useTimer } from '@/hooks/useTimer'
import QuizCard from '@/components/game/QuizCard'
import ResultCard from '@/components/game/ResultCard'

interface Props {
  artistId: string
}

export default function QuizGame({ artistId }: Props) {
  const { gameState, answerQuestion } = useGame(artistId)

  const handleExpire = () => {
    answerQuestion('', 0)
  }

  const { timeLeft, start, stop, reset } = useTimer(handleExpire)

  if (gameState.status === 'idle') {
    return (
      <main className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto' />
          <p className='text-zinc-400'>Loading tracks...</p>
        </div>
      </main>
    )
  }

  if (gameState.status === 'finished') {
    return <ResultCard gameState={gameState} />
  }

  const currentQuestion = gameState.questions[gameState.currentIndex]

  return (
    <QuizCard
      question={currentQuestion}
      questionNumber={gameState.currentIndex + 1}
      totalQuestions={gameState.questions.length}
      timeLeft={timeLeft}
      score={gameState.score}
      onAnswer={(answer) => {
        stop()
        answerQuestion(answer, timeLeft)
        reset()
        start()
      }}
      onStart={start}
    />
  )
}
