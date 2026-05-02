import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Who Do You Stan? — Guess the Song Music Quiz',
  description:
    "Pick your favourite artist, listen to a 30-second clip, and guess the song. Find out if you're a real fan or just a casual listener. Free music quiz — no account needed.",
  keywords: [
    'guess the song',
    'music quiz',
    'song guessing game',
    'guess the song quiz',
    'music fan quiz',
    'who do you stan',
    'artist quiz',
    'song quiz game',
    'music trivia',
    'guess the track',
    'name that song',
    'music challenge',
  ],
  metadataBase: new URL('https://whodoyoustan.com'),
  alternates: {
    canonical: 'https://whodoyoustan.com',
  },
  openGraph: {
    title: 'Who Do You Stan? — Guess the Song Music Quiz',
    description:
      'Pick your favourite artist, listen to a 30-second clip, and guess the song. Are you a real fan?',
    url: 'https://whodoyoustan.com',
    siteName: 'Who Do You Stan?',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Who Do You Stan? — Guess the Song Music Quiz',
    description:
      'Pick your favourite artist, listen to a 30-second clip, and guess the song. Are you a real fan?',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
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
