'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GameState, QuizQuestion, SpotifyTrack, UserAnswer } from '@/types'
import { GAME_CONFIG } from '@/constants'

// Lightweight type for distractor-only tracks (no preview_url needed)
interface DistractorTrack {
  id: string
  name: string
  album: {
    name: string
    images: { url: string; width: number; height: number }[]
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Pick distractors for a question.
 *
 * Uses the full distractorPool (no preview needed — names only).
 *
 * Priority:
 *   1. Same-album tracks first — fan has to know the exact song name
 *   2. Any other track as fallback
 *
 * Never includes:
 *   - The correct track itself
 *   - Any song that is a correct answer elsewhere in the quiz (bannedNames)
 */
function pickDistractors(
  correctTrack: SpotifyTrack,
  distractorPool: DistractorTrack[],
  bannedNames: Set<string>,
  count: number,
): string[] {
  const correctKey = correctTrack.name.toLowerCase().trim()

  const eligible = distractorPool.filter((t) => {
    const key = t.name.toLowerCase().trim()
    return key !== correctKey && !bannedNames.has(key)
  })

  const sameAlbum = shuffleArray(
    eligible.filter((t) => t.album.name === correctTrack.album.name),
  )
  const others = shuffleArray(
    eligible.filter((t) => t.album.name !== correctTrack.album.name),
  )

  const picked: DistractorTrack[] = []

  const addFrom = (pool: DistractorTrack[]) => {
    for (const t of pool) {
      if (picked.length >= count) break
      const key = t.name.toLowerCase().trim()
      if (!picked.find((p) => p.name.toLowerCase().trim() === key)) {
        picked.push(t)
      }
    }
  }

  // same-album first, then anything else
  addFrom(sameAlbum)
  addFrom(others)

  // absolute last resort — ignore banned names if we're still short
  if (picked.length < count) {
    const fallback = shuffleArray(
      distractorPool.filter((t) => {
        const key = t.name.toLowerCase().trim()
        return (
          key !== correctKey &&
          !picked.find((p) => p.name.toLowerCase().trim() === key)
        )
      }),
    )
    addFrom(fallback)
  }

  return picked.slice(0, count).map((t) => t.name)
}

/**
 * Build 10 questions from a fully shuffled playable pool.
 * Distractors come from the separate distractorPool which includes
 * ALL album tracks regardless of preview availability.
 */
function buildQuestions(
  tracks: SpotifyTrack[],
  distractorPool: DistractorTrack[],
): QuizQuestion[] {
  // Deduplicate playable tracks by name
  const seen = new Set<string>()
  const unique = tracks.filter((t) => {
    const key = t.name.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Fully random — no tiers, different every session
  const selected = shuffleArray(unique).slice(0, GAME_CONFIG.TOTAL_QUESTIONS)

  // Pre-ban ALL correct answers from being distractors anywhere in the quiz
  const allCorrectNames = new Set(
    selected.map((t) => t.name.toLowerCase().trim()),
  )

  return selected.map((track) => {
    const correctKey = track.name.toLowerCase().trim()

    // Remove this question's own answer from the banned set
    const bannedForThisQuestion = new Set(
      [...allCorrectNames].filter((k) => k !== correctKey),
    )

    const distractors = pickDistractors(
      track,
      distractorPool,
      bannedForThisQuestion,
      GAME_CONFIG.OPTIONS_COUNT - 1,
    )

    const options = shuffleArray([track.name, ...distractors])

    return {
      track,
      options,
      correctAnswer: track.name,
    } satisfies QuizQuestion
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
        const [tracksRes, artistRes] = await Promise.all([
          fetch(`/api/deezer/tracks?artistId=${artistId}`, {
            signal: controller.signal,
          }),
          fetch(`/api/deezer/artist?artistId=${artistId}`, {
            signal: controller.signal,
          }),
        ])

        if (controller.signal.aborted) return

        const data = (await tracksRes.json()) as {
          tracks: SpotifyTrack[]
          distractorPool: DistractorTrack[]
        }
        const artistData = (await artistRes.json()) as {
          name: string
          image: string
        }

        if (controller.signal.aborted) return

        if (data.tracks.length < 4) {
          console.error('Not enough tracks to build a quiz')
          return
        }

        const questions = buildQuestions(data.tracks, data.distractorPool)

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
    return () => controller.abort()
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
