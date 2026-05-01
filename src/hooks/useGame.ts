import { useState, useEffect, useCallback } from 'react'
import type { GameState, QuizQuestion, SpotifyTrack, UserAnswer } from '@/types'
import { GAME_CONFIG } from '@/constants'

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

function buildQuestions(tracks: SpotifyTrack[]): QuizQuestion[] {
  const shuffled = shuffleArray(tracks)
  const total = Math.min(GAME_CONFIG.TOTAL_QUESTIONS, shuffled.length)
  const selected = shuffled.slice(0, total)

  return selected.map((track) => {
    const otherTracks = tracks.filter((t) => t.id !== track.id)
    const decoys = shuffleArray(otherTracks)
      .slice(0, Math.min(GAME_CONFIG.OPTIONS_COUNT - 1, otherTracks.length))
      .map((t) => t.name)

    const options = shuffleArray([...decoys, track.name])

    return {
      track,
      options,
      correctAnswer: track.name,
    }
  })
}

export function useGame(artistId: string) {
  const [gameState, setGameState] = useState<GameState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    status: 'idle',
  })

  useEffect(() => {
    async function loadTracks() {
      try {
        const res = await fetch(`/api/spotify/tracks?artistId=${artistId}`)
        const data = (await res.json()) as { tracks: SpotifyTrack[] }

        console.log('Tracks received:', data.tracks.length)

        if (data.tracks.length < 4) {
          console.error('Not enough tracks')
          return
        }

        const questions = buildQuestions(data.tracks)
        setGameState((prev) => ({
          ...prev,
          questions,
          status: 'playing',
        }))
      } catch (error) {
        console.error('Failed to load tracks:', error)
      }
    }

    loadTracks()
  }, [artistId])

  const answerQuestion = useCallback(
    (selectedAnswer: string, timeLeft: number) => {
      const currentQuestion = gameState.questions[gameState.currentIndex]
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer

      const answer: UserAnswer = {
        questionIndex: gameState.currentIndex,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
        timeLeft,
      }

      const newScore = isCorrect ? gameState.score + 1 : gameState.score
      const newIndex = gameState.currentIndex + 1
      const isFinished = newIndex >= gameState.questions.length

      setGameState((prev) => ({
        ...prev,
        currentIndex: newIndex,
        score: newScore,
        answers: [...prev.answers, answer],
        status: isFinished ? 'finished' : 'playing',
      }))
    },
    [gameState],
  )

  return { gameState, answerQuestion }
}
