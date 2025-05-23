import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const requestData = await req.json()
        
        // Use the proxy endpoint
        const response = await fetch(`${req.nextUrl.origin}/api/proxy?endpoint=/api/charts/suggestion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.get('Authorization') || ''
            },
            body: JSON.stringify(requestData)
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to get chart suggestions' },
                { status: response.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in suggestion API route:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 