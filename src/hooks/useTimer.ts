import { useState, useEffect, useCallback, useRef } from 'react'
import { GAME_CONFIG } from '@/constants'

export function useTimer(onExpire: () => void) {
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.TIMER_SECONDS)
  const [isRunning, setIsRunning] = useState(false)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsRunning(false)
          setTimeout(() => onExpireRef.current(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

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
