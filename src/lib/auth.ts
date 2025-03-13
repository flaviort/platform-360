// libraries
import type { NextAuthOptions } from 'next-auth'
import credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { DefaultSession } from 'next-auth'

// db
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
        } & DefaultSession['user']
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        credentials({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    await connectDB()
                    
                    const user = await User.findOne({
                        email: credentials?.email,
                    }).select('+password')
                    
                    if (!user) {
                        throw new Error('Wrong Email')
                    }

                    const passwordMatch = await bcrypt.compare(
                        credentials!.password,
                        user.password
                    )

                    if (!passwordMatch) {
                        throw new Error('Wrong Password')
                    }

                    return {
                        id: user._id,
                        email: user.email,
                        name: user.name
                        // Add any other user fields you want to include
                    }
                } catch (error) {
                    throw error
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login', // Custom login page path if you have one
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                // Add any other user properties you want to include in the token
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                // Add any other user properties you want to include in the session
            }
            return session
        },
    },
}