export interface SpotifyTrack {
  id: string
  name: string
  preview_url: string | null
  uri: string
  album: {
    name: string
    images: SpotifyImage[]
  }
  artists: SpotifyArtist[]
}

export interface SpotifyArtist {
  id: string
  name: string
  images: SpotifyImage[]
}

export interface SpotifyImage {
  url: string
  width: number
  height: number
}

export interface QuizQuestion {
  track: SpotifyTrack
  options: string[]
  correctAnswer: string
}

export interface GameState {
  questions: QuizQuestion[]
  currentIndex: number
  score: number
  answers: UserAnswer[]
  status: 'idle' | 'playing' | 'finished'
  artistName: string
  artistImage: string
}

export interface UserAnswer {
  questionIndex: number
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeLeft: number
}

export interface FanRank {
  title: string
  description: string
  minScore: number
}

export interface SpotifyPlayer {
  connect: () => Promise<boolean>
  disconnect: () => void
  addListener: (event: string, callback: (data: unknown) => void) => void
  removeListener: (event: string) => void
  getCurrentState: () => Promise<unknown>
  setVolume: (volume: number) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  togglePlay: () => Promise<void>
  seek: (position: number) => Promise<void>
  previousTrack: () => Promise<void>
  nextTrack: () => Promise<void>
}

export type AnswerState = 'unanswered' | 'correct' | 'wrong' | 'expired'
