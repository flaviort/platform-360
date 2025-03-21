'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { UserProvider } from '@/contexts/UserContext'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </AuthProvider>
    )
} 