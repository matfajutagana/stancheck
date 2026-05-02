'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { useTimer } from '@/hooks/useTimer'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import QuizCard from '@/components/game/QuizCard'
import ResultCard from '@/components/game/ResultCard'

interface Props {
  artistId: string
}

export default function QuizGame({ artistId }: Props) {
  const { gameState, answerQuestion } = useGame(artistId)
  const timerStartedRef = useRef(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentPreviewUrl = useRef<string | null>(null)

  const handleExpire = useCallback(() => {
    timerStartedRef.current = false
    setSelectedAnswer('')
    setIsAnswered(true)
    setIsPlaying(false)
    pauseTrack()
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current)
    advanceTimeoutRef.current = setTimeout(() => {
      answerQuestion('', 0)
      setIsAnswered(false)
      setIsPlaying(false)
    }, 1500)
  }, [answerQuestion])

  const { timeLeft, start, stop, reset } = useTimer(handleExpire)

  const handleTrackReady = useCallback(() => {
    if (!timerStartedRef.current) {
      timerStartedRef.current = true
      start()
    }
  }, [start])

  const { isReady, playTrack, pauseTrack, stopTrack } =
    useAudioPlayer(handleTrackReady)

  // when question changes reset state
  useEffect(() => {
    if (
      isReady &&
      gameState.status === 'playing' &&
      gameState.questions.length > 0
    ) {
      const currentTrack = gameState.questions[gameState.currentIndex]?.track
      timerStartedRef.current = false
      setIsAnswered(false)
      setSelectedAnswer('')
      setIsPlaying(false)
      reset()

      if (currentTrack?.preview_url) {
        currentPreviewUrl.current = currentTrack.preview_url
      }
    }
  }, [gameState.currentIndex, isReady, gameState.status])

  useEffect(() => {
    return () => {
      stopTrack()
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current)
    }
  }, [])

  function handlePlay() {
    if (currentPreviewUrl.current) {
      setIsPlaying(true)
      playTrack(currentPreviewUrl.current)
    }
  }

  if (gameState.status === 'idle') {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: 'var(--cream)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '300px' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.2em',
              marginBottom: '2rem',
            }}
          >
            STANCHECK
          </p>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '2px solid var(--cream-border)',
              borderTop: '2px solid var(--accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem',
            }}
          />
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              color: 'var(--text-primary)',
              fontWeight: 900,
              marginBottom: '8px',
            }}
          >
            Loading tracks...
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
            }}
          >
            getting your quiz ready
          </p>
        </div>
      </main>
    )
  }

  if (gameState.status === 'finished') {
    return <ResultCard gameState={gameState} />
  }

  const currentQuestion = gameState.questions[gameState.currentIndex]
  if (!currentQuestion) return null

  return (
    <QuizCard
      question={currentQuestion}
      questionNumber={gameState.currentIndex + 1}
      totalQuestions={gameState.questions.length}
      timeLeft={timeLeft}
      score={gameState.score}
      isAnswered={isAnswered}
      selectedAnswer={selectedAnswer}
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onAnswer={(answer) => {
        if (isAnswered || !isPlaying) return
        stop()
        pauseTrack()
        timerStartedRef.current = false
        setSelectedAnswer(answer)
        setIsAnswered(true)
        if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current)
        advanceTimeoutRef.current = setTimeout(() => {
          answerQuestion(answer, timeLeft)
          setIsAnswered(false)
          setSelectedAnswer('')
          setIsPlaying(false)
        }, 1500)
      }}
    />
  )
}
