import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { question, report_id } = body

        console.log('Chat request received:', { question, report_id })

        if (!question || !report_id) {
            console.error('Missing required fields:', { question, report_id })
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const authHeader = request.headers.get('Authorization')
        if (!authHeader) {
            console.error('Missing Authorization header')
            return NextResponse.json(
                { error: 'Missing Authorization header' },
                { status: 401 }
            )
        }

        // Use the proxy endpoint with the correct path
        const proxyUrl = new URL('/api/proxy', request.url)
        proxyUrl.searchParams.set('endpoint', '/api/chats')

        const response = await fetch(proxyUrl.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify({
                question,
                report_id
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Backend error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            })
            return NextResponse.json(
                { error: 'Backend error', details: errorText },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log('Chat response received:', data)
        return NextResponse.json(data)

    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            { error: 'Failed to process chat request', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
} 