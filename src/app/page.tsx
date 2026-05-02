import Link from 'next/link'

export default function HomePage() {
  return (
    <main className='min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 relative overflow-hidden'>
      <div className='max-w-sm w-full text-center space-y-8 relative z-10'>
        <div className='space-y-3'>
          <h1
            className='text-7xl text-white'
            style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
          >
            STAN<span className='text-[#ff3e3e'>CHECK</span>
          </h1>
          <p
            className='text-[#c8b89a] text-lg'
            style={{ fontFamily: 'var(--font-special-elite)' }}
          >
            think you know your favourite artist?
          </p>
        </div>

        <div className='flex items-center justify-center gap-0 text-xs text-[#0a0a0a] font-bold tracking-widest'>
          <span className='bg-[#ff3e3e] px-3 py-1'>10 TRACKS</span>
          <span className='bg-[#e8e0d0] px-3 py-1'>15 SEC EACH</span>
          <span className='bg-[#ff3e3e] px-3 py-1'>FAN RANK</span>
        </div>

        <div className='relative'>
          <div className='absolute inset-0 bg-[#ff3e3e] translate-x-1 translate-y-1' />
          <Link
            href='/search'
            className='relative block w-full bg-[#e8e0d0] text-[#0a0a0a] font-bold py-4 px-8 text-2xl text-center transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1'
            style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.1em' }}
          >
            START PLAYING
          </Link>
        </div>

        <p className='text-zinc-600 text-xs font-mono'>
          // powered by deezer — no account needed
        </p>
      </div>
    </main>
  )
}
