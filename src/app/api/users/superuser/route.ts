import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { email } = body
		
		console.log('Promote user to superuser request body:', body)
		
		if (!email) {
			return NextResponse.json({ error: 'User email is required' }, { status: 400 })
		}
		
		const authToken = request.headers.get('Authorization')
		console.log('Auth token:', authToken ? 'Present (not shown for security)' : 'Missing')
		
		if (!authToken) {
			return NextResponse.json({ error: 'Authorization is required' }, { status: 401 })
		}

		console.log('Promote user to superuser API called with email:', email)
		
		// Make request to the backend API for superuser promotion
		const apiUrl = 'http://shop36-testb-a0u5doexwffx-959882810.us-east-1.elb.amazonaws.com/api/users/superuser'
		console.log('Sending POST request to:', apiUrl)
		
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Authorization': authToken,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			})
			
			console.log('Promote user to superuser response status:', response.status)

			if (!response.ok) {
				let errorText = await response.text()
				console.error('Error from promote user to superuser endpoint:', errorText)
				
				return NextResponse.json({
					error: 'Failed to promote user to superuser',
					status: response.status,
					details: errorText
				}, { status: response.status })
			}
			
			const data = await response.json().catch(() => ({}))
			return NextResponse.json({ success: true, data })
		} catch (error: any) {
			console.error('Error making promote user to superuser request:', error?.message || 'Unknown error')
			
			return NextResponse.json({
				error: 'Failed to promote user to superuser',
				details: error?.message || 'Unknown error'
			}, { status: 500 })
		}
	} catch (error: any) {
		console.error('Error in superuser route:', error?.message || 'Unknown error')
		return NextResponse.json({ 
			error: 'Internal server error',
			details: error?.message || 'Unknown error'
		}, { status: 500 })
	}
} 