import ArtistSearch from '@/components/game/ArtistSearch'

export default function SearchPage() {
  return (
    <main className='min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 relative overflow-hidden'>
      <div className='absolute top-6 left-6 text-zinc-700 text-xs font-mono rotate-[-5deg]'>
        WHO DO YOU STAN?
      </div>

      <div className='max-w-sm w-full space-y-8 relative z-10'>
        <div className='text-center space-y-2'>
          <h1
            className='text-6xl text-white'
            style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
          >
            PICK AN <span className='text-[#ff3e3e]'>ARTIST</span>
          </h1>
          <p
            className='text-[#c8b89a] text-sm'
            style={{ fontFamily: 'var(--font-special-elite)' }}
          >
            search for your favourite artist to start the quiz
          </p>
        </div>
        <ArtistSearch />
      </div>
    </main>
  )
}
