import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ArtistSearch from '@/components/game/ArtistSearch'

export default async function SearchPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('spotify_access_token')

  if (!token) {
    redirect('/')
  }

  return (
    <main className='min-h-screen bg-black flex flex-col items-center justify-center px-4'>
      <div className='max-w-md w-full text-center space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-4xl font-bold text-white'>
            Pick an <span className='text-green-400'>Artist</span>
          </h1>
          <p className='text-zinc-400'>
            Search for your favourite artist to start the quiz
          </p>
        </div>
        <ArtistSearch />
      </div>
    </main>
  )
}
