import { useState, useEffect, useCallback } from 'react'
import { GAME_CONFIG } from '@/constants'

export function useTimer(onExpire: () => void) {
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.TIMER_SECONDS)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    if (timeLeft === 0) {
      onExpire()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, isRunning, onExpire])

  const start = useCallback(() => {
    setTimeLeft(GAME_CONFIG.TIMER_SECONDS)
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(GAME_CONFIG.TIMER_SECONDS)
    setIsRunning(false)
  }, [])

  return { timeLeft, isRunning, start, stop, reset }
}
