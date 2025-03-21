'use client'

// libraries
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UserData {
    id?: string
    email: string
    name?: {
        first?: string
        last?: string
    }
    image?: string
    is_active: boolean
    is_superuser: boolean
    is_verified: boolean
}

interface UserContextType {
    userData: UserData | null
    setUserData: (data: UserData | null) => void
    fetchUserData: () => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<UserData | null>(null)

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) return

            const response = await fetch('/api/proxy?endpoint=/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setUserData({
                    ...data,
                    name: {},
                    image: undefined
                })
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    useEffect(() => {
        // Check if we're in the browser
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token')
            if (token) {
                fetchUserData()
            }
        }
    }, [])

    return (
        <UserContext.Provider value={{ userData, setUserData, fetchUserData }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
} 