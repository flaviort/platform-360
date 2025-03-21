'use client'

// libraries
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// utils
import { pages } from '@/utils/routes'

interface AuthContextType {
    isAuthenticated: boolean
    setIsAuthenticated: (value: boolean) => void
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const localToken = localStorage.getItem('auth_token')
            const cookieToken = document.cookie.includes('auth_token=')
            setIsAuthenticated(!!(localToken && cookieToken))
        }
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const formData = new URLSearchParams()
            formData.append('username', email)
            formData.append('password', password)
            formData.append('grant_type', 'password')
            
            const response = await fetch('/api/proxy?endpoint=/api/auth/jwt/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })

            if (response.ok) {
                const data = await response.json()
                localStorage.setItem('auth_token', data.access_token)
                document.cookie = `auth_token=${data.access_token}; path=/`
                setIsAuthenticated(true)
                return true
            }

            return false
        } catch (error) {
            return false
        }
    }

    const logout = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (token) {
                
                // fire and forget the logout request
                fetch('/api/proxy?endpoint=/api/auth/jwt/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        // silently handle non-200 responses
                        return
                    }
                })
                .catch(() => {
                    // silently handle any network errors
                    return
                })
            }
        } finally {
            
            // always clear local tokens and state
            localStorage.removeItem('auth_token')
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
            setIsAuthenticated(false)
            router.push(pages.account.login)
        }
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