import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "StanCheck — Prove You're a Real Fan",
  description: '10 songs. 15 seconds each. Prove it.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
