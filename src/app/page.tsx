import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import LoginButton from '@/components/ui/LoginButton'

export default async function HomePage() {
  const session = await getServerSession()

  if (session) {
    redirect('/search')
  }

  return (
    <main className='min-h-screen bg-black flex flex-col items-center justify-center px-4'>
      <div className='max-w-md w-full text-center space-y-8'>
        <div className='space-y-3'>
          <h1 className='text-6xl font-bold text-white tracking-tight'>
            Stan<span className='text-green-400'>Check</span>
          </h1>
          <p className='text-zinc-400 text-lg'>
            Think you know your favourite artist?
          </p>
          <p className='text-zinc-600 text-sm'>
            10 songs. 15 seconds each. Prove it.
          </p>
        </div>
        <div className='flex items-center justify-center gap-6 text-zinc-500 text-sm'>
          <span>🎵 10 rounds</span>
          <span>⏱️ 15s timer</span>
          <span>🏆 Fan rank</span>
        </div>
        <LoginButton />
        <p className='text-zinc-700 text-xs'>
          Powered by Spotify — requires a Spotify account
        </p>
      </div>
    </main>
  )
}
