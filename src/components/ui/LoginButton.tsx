'use client'

export default function LoginButton() {
  return (
    <a
      href='/api/auth/login'
      className='block w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-4 px-8 rounded-full text-lg transition-all duration-200 active:scale-95 text-center'
    >
      Login with Spotify
    </a>
  )
}
