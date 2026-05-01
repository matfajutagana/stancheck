import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import QuizGame from '@/components/game/QuizGame'

interface Props {
  params: Promise<{ artistId: string }>
}

export default async function QuizPage({ params }: Props) {
  const cookieStore = await cookies()
  const token = cookieStore.get('spotify_access_token')

  if (!token) {
    redirect('/')
  }

  const { artistId } = await params

  return <QuizGame artistId={artistId} />
}
