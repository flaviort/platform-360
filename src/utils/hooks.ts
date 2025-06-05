import { useState } from 'react'

interface ChartSuggestionParams {
    product_name?: string
    category?: string[]
    color?: string[]
    company?: string[]
    brand?: string[]
    gender?: string[]
    comment?: string
}

interface UseChartSuggestionResult {
    suggestions: any | null
    loading: boolean
    error: string | null
    getSuggestions: (params: ChartSuggestionParams, onSuccess?: (data: any) => void) => Promise<void>
}

/**
 * Hook for getting chart suggestions from the API
 */
export function useChartSuggestion(): UseChartSuggestionResult {
    const [suggestions, setSuggestions] = useState<any | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const getSuggestions = async (params: ChartSuggestionParams, onSuccess?: (data: any) => void) => {
        try {
            setLoading(true)
            setError(null)
            
            // Get the auth token from localStorage
            const token = localStorage.getItem('auth_token')
            
            console.log('Sending goal to API:', {
                params,
                hasToken: !!token,
                endpoint: '/api/suggestion'
            })
            
            const response = await fetch('/api/suggestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(params),
            })

            console.log('Goal response from API:', response.status, response.statusText)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('❌ API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData
                })
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            console.log('✅ API Success Response:', data)
            
            setSuggestions(data)
            
            // Call the success callback with the data if provided
            if (onSuccess && data) {
                onSuccess(data)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
            console.error('💥 Error in getSuggestions:', {
                error: err,
                errorMessage,
                params
            })
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return {
        suggestions,
        loading,
        error,
        getSuggestions,
    }
} 