import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ')

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: SPOTIFY_SCOPES,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token ?? ''
        token.refreshToken = account.refresh_token ?? ''
        token.expiresAt = account.expires_at ?? 0
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/',
  },
})

export { handler as GET, handler as POST }
