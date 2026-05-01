'use client'

import { signIn } from 'next-auth/react'

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn('spotify', { callbackUrl: '/search' })}
      className='w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-4 px-8 rounded-full text-lg transition-all duration-200 active:scale-95'
    >
      Login with Spotify
    </button>
  )
}
