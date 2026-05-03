import type { FanRank } from '@/types'

export const GAME_CONFIG = {
  TOTAL_QUESTIONS: 10,
  TIMER_SECONDS: 15,
  PREVIEW_DURATION: 30,
  OPTIONS_COUNT: 4,
} as const

export const FAN_RANKS: FanRank[] = [
  {
    title: 'Certified Stan',
    description: 'You know every track. Respect.',
    minScore: 10,
  },
  {
    title: 'Day One',
    description: 'You were there before the hype.',
    minScore: 8,
  },
  {
    title: 'Real One',
    description: 'You definitely know the albums.',
    minScore: 6,
  },
  {
    title: 'Solid Fan',
    description: 'You know more than the average listener.',
    minScore: 4,
  },
  {
    title: 'Casual Listener',
    description: 'You know the hits but not the deep cuts.',
    minScore: 2,
  },
  {
    title: 'Who Are You',
    description: 'Are you sure you picked the right artist?',
    minScore: 0,
  },
]
