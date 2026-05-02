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

  // DON'T shuffle all tracks — preserve order from API
  // First 5 = popular hits (easy), rest = deep cuts (hard)
  // Only shuffle within each group
  const easyPool = uniqueTracks.slice(0, 5)
  const hardPool = uniqueTracks.slice(5)

  const shuffledEasy = shuffleArray(easyPool)
  const shuffledHard = shuffleArray(hardPool)

  // take up to 5 easy + 5 hard
  const selected = [...shuffledEasy.slice(0, 5), ...shuffledHard.slice(0, 5)]

  return selected.map((track, i) => {
    const pool = uniqueTracks.filter(
      (t) => t.name.toLowerCase().trim() !== track.name.toLowerCase().trim(),
    )

    const decoys = shuffleArray(pool)
      .slice(0, Math.min(GAME_CONFIG.OPTIONS_COUNT - 1, pool.length))
      .map((t) => t.name)

    const options = shuffleArray([track.name, ...decoys])

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
          fetch(`/api/deezer/tracks?artistId=${artistId}`),
          fetch(`/api/deezer/artist?artistId=${artistId}`),
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
