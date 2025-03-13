'use client'

// libraries
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// utils
import { pages } from '@/utils/routes'

export type AuthContextType = {
    isAuthenticated: boolean
    user: {
        id: string
        // add other user properties you need
    } | null
    setIsAuthenticated: (value: boolean) => void
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const localToken = localStorage.getItem('auth_token')
        const cookieToken = document.cookie.includes('auth_token=')
        setIsAuthenticated(!!(localToken && cookieToken))
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/account/auth', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            })

            if (response.ok) {
                localStorage.setItem('auth_token', 'fake_token')
                setIsAuthenticated(true)
                return true
            }

            return false

        } catch (error) {
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem('auth_token')
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        setIsAuthenticated(false)
        router.push(pages.account.login)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 