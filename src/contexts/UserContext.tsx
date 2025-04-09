'use client'

// libraries
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UserData {
    id?: string
    email: string
    password: string
    is_active: boolean
    is_superuser: boolean
    is_verified: boolean
    
    first_name?: string
    last_name?: string
    phone?: string
    role?: string
    company_name?: string
    country?: string
    state?: string
    city?: string
    zip_code?: string

    image?: string
}

interface UserContextType {
    userData: UserData | null
    setUserData: (data: UserData | null) => void
    fetchUserData: () => Promise<void>
    updateUserData: (data: Partial<UserData>) => void
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
                setUserData({ ...data })
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }
    
    const updateUserData = (data: Partial<UserData>) => {
        if (userData) {
            setUserData({ ...userData, ...data })
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
        <UserContext.Provider value={{ userData, setUserData, fetchUserData, updateUserData }}>
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