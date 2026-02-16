import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { comparePasswords } from '@/lib/passwords'
import { findUserByEmail } from '@/lib/users-db'
import type { User as NextAuthUser } from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    role: 'admin' | 'user'
    department?: string
    employeeId?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'admin' | 'user'
      department?: string
      employeeId?: string
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        console.debug('[NextAuth] Credentials.authorize called for', credentials?.email)
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Find user by email
        const user = findUserByEmail(credentials.email as string)
        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Compare passwords
        const passwordMatch = await comparePasswords(
          credentials.password as string,
          user.password
        )

        if (!passwordMatch) {
          throw new Error('Invalid email or password')
        }

        console.debug('[NextAuth] Credentials.authorize succeeded for', user.email)
        // Return user object (password excluded)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          employeeId: user.employeeId,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        console.debug('[NextAuth] jwt callback - user present', user.email, user.role)
        token.id = user.id
        token.role = user.role || 'user' // Default to 'user' role for OAuth
        token.department = user.department
        token.employeeId = user.employeeId
      }
      
      // For Google OAuth users without database entry
      if (account?.provider === 'google' && !user?.role) {
        token.role = 'user'
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        console.debug('[NextAuth] session callback - token.role =', token.role)
        session.user.id = token.id as string
        session.user.role = (token.role as 'admin' | 'user') || 'user'
        session.user.department = token.department as string
        session.user.employeeId = token.employeeId as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  events: {
    async signIn({ user }) {
      console.log(`✅ User signed in: ${user.email}`)
    },
    async signOut() {
      console.log(`❌ User signed out`)
    },
  },
})
