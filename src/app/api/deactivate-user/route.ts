import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { id } = body
		
		console.log('Deactivate user request body:', body)
		
		if (!id) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
		}
		
		const authToken = request.headers.get('Authorization')
		console.log('Auth token:', authToken ? 'Present (not shown for security)' : 'Missing')
		
		if (!authToken) {
			return NextResponse.json({ error: 'Authorization is required' }, { status: 401 })
		}

		console.log('Deactivate user API called with userId:', id)
		
		// Make request to the backend API for deactivation
		const apiUrl = 'http://shop36-testb-a0u5doexwffx-959882810.us-east-1.elb.amazonaws.com/api/users/deactivate'
		console.log('Sending POST request to:', apiUrl)
		
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Authorization': authToken,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id })
			})
			
			console.log('Deactivate user response status:', response.status)

			if (!response.ok) {
				let errorText = await response.text()
				console.error('Error from deactivate user endpoint:', errorText)
				
				return NextResponse.json({
					error: 'Failed to deactivate user',
					status: response.status,
					details: errorText
				}, { status: response.status })
			}
			
			const data = await response.json().catch(() => ({}))
			return NextResponse.json({ success: true, data })
		} catch (error: any) {
			console.error('Error making deactivate user request:', error?.message || 'Unknown error')
			
			return NextResponse.json({
				error: 'Failed to deactivate user',
				details: error?.message || 'Unknown error'
			}, { status: 500 })
		}
	} catch (error: any) {
		console.error('Error in deactivate-user route:', error?.message || 'Unknown error')
		return NextResponse.json({ 
			error: 'Internal server error',
			details: error?.message || 'Unknown error'
		}, { status: 500 })
	}
} 