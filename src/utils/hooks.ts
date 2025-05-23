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
            
            const response = await fetch('/api/suggestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            setSuggestions(data)
            
            // Call the success callback with the data if provided
            if (onSuccess && data) {
                onSuccess(data)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
            setError(errorMessage)
            console.error('Error fetching chart suggestions:', err)
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