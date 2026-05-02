import { useState, useEffect, useCallback } from 'react'
import type { GameState, QuizQuestion, SpotifyTrack, UserAnswer } from '@/types'
import { GAME_CONFIG } from '@/constants'

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

function buildQuestions(tracks: SpotifyTrack[]): QuizQuestion[] {
  const seen = new Set<string>()
  const uniqueTracks = tracks.filter((track) => {
    const key = track.name.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  console.log('Building questions from', uniqueTracks.length, 'unique tracks')

  const shuffled = shuffleArray(uniqueTracks)
  const total = Math.min(GAME_CONFIG.TOTAL_QUESTIONS, shuffled.length)
  const selected = shuffled.slice(0, total)

  return selected.map((track, i) => {
    const pool = uniqueTracks.filter(
      (t) => t.name.toLowerCase().trim() !== track.name.toLowerCase().trim(),
    )

    const decoys = shuffleArray(pool)
      .slice(0, Math.min(GAME_CONFIG.OPTIONS_COUNT - 1, pool.length))
      .map((t) => t.name)

    const options = shuffleArray([track.name, ...decoys])

    const hasCorrect = options.includes(track.name)
    if (!hasCorrect) {
      console.error(`Q${i + 1} missing correct answer!`, track.name, options)
    }

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
    artistName: '',
    artistImage: '',
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadTracks() {
      try {
        // fetch artist info and tracks together
        const [tracksRes, artistRes] = await Promise.all([
          fetch(`/api/spotify/tracks?artistId=${artistId}`),
          fetch(`/api/spotify/artist?artistId=${artistId}`),
        ])

        if (controller.signal.aborted) return

        const data = (await tracksRes.json()) as { tracks: SpotifyTrack[] }
        const artistData = (await artistRes.json()) as {
          name: string
          image: string
        }

        if (controller.signal.aborted) return

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
          artistName: artistData.name,
          artistImage: artistData.image,
        }))
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load tracks:', error)
        }
      }
    }

    loadTracks()

    return () => {
      controller.abort()
    }
  }, [artistId])

  const answerQuestion = useCallback(
    (selectedAnswer: string, timeLeft: number) => {
      const currentQuestion = gameState.questions[gameState.currentIndex]

      if (!currentQuestion) return

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
