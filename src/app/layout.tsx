import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StanCheck — How well do you know your artist?',
  description: '10 tracks. 15 seconds each. Find out your fan rank.',
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
