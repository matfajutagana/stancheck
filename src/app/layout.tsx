import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Who Do You Stan? — Prove you know your artist',
  description:
    "Pick your favourite artist, guess the songs, find out if you're a real fan.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning className='grain'>
        {children}
      </body>
    </html>
  )
}
