export async function POST(request: Request) {
    const url = new URL(request.url)
    const targetEndpoint = url.searchParams.get('endpoint')
    
    if (!targetEndpoint) {
        return new Response(
            JSON.stringify({ message: 'No endpoint specified' }),
            { status: 400 }
        )
    }

    try {
        const contentType = request.headers.get('Content-Type')
        let body

        if (contentType === 'application/x-www-form-urlencoded') {
            const formData = await request.formData()
            const params = new URLSearchParams()
            formData.forEach((value, key) => {
                params.append(key, value.toString())
            })
            body = params
        } else {
            body = await request.json().catch(() => ({}))
        }

        const response = await fetch(
            `http://cdksta-backe-neoxdo9tpwmg-42863291.us-east-1.elb.amazonaws.com${targetEndpoint}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': contentType || 'application/json',
                    'Authorization': request.headers.get('Authorization') || ''
                },
                body: typeof body === 'string' ? body : 
                      body instanceof URLSearchParams ? body.toString() : 
                      JSON.stringify(body)
            }
        )

        // Special handling for logout endpoint which might not return JSON
        if (targetEndpoint === '/api/auth/jwt/logout') {
            return new Response(null, {
                status: response.status
            })
        }

        const data = await response.json().catch(() => ({}))
        
        // Handle specific error cases
        if (!response.ok) {
            let errorMessage = 'An unexpected error occurred'
            
            if (data.detail === 'LOGIN_BAD_CREDENTIALS') {
                errorMessage = 'Invalid email or password'
            } else if (data.detail === 'LOGIN_USER_NOT_VERIFIED') {
                errorMessage = 'Please verify your email before logging in'
            } else if (Array.isArray(data.detail)) {
                errorMessage = data.detail[0]?.msg || 'Validation error'
            }

            return new Response(
                JSON.stringify({ message: errorMessage }),
                { 
                    status: response.status,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }

        // Handle successful response
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Proxy error:', error)
        return new Response(
            JSON.stringify({ 
                message: 'An error occurred while processing your request'
            }),
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    const url = new URL(request.url)
    const targetEndpoint = url.searchParams.get('endpoint')
    
    if (!targetEndpoint) {
        return new Response(
            JSON.stringify({ message: 'No endpoint specified' }),
            { status: 400 }
        )
    }

    try {
        const response = await fetch(
            `http://cdksta-backe-neoxdo9tpwmg-42863291.us-east-1.elb.amazonaws.com${targetEndpoint}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': request.headers.get('Authorization') || '',
                    'Content-Type': 'application/json'
                }
            }
        )

        const data = await response.json()
        
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Proxy error:', error)
        return new Response(
            JSON.stringify({ 
                message: 'Proxy error', 
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500 }
        )
    }
} 