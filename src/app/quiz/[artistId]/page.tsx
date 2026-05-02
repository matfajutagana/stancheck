import QuizGame from '@/components/game/QuizGame'

interface Props {
  params: Promise<{ artistId: string }>
}

export default async function QuizPage({ params }: Props) {
  const { artistId } = await params
  return <QuizGame artistId={artistId} />
}
