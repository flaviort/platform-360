import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { userId } = body
		
		console.log('Delete user request body:', body)
		
		if (!userId) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
		}
		
		const authToken = request.headers.get('Authorization')
		console.log('Auth token:', authToken ? 'Present (not shown for security)' : 'Missing')
		
		if (!authToken) {
			return NextResponse.json({ error: 'Authorization is required' }, { status: 401 })
		}

		console.log('Delete user API called with userId:', userId)
		
		// Direct delete request to the backend API
		const apiUrl = 'http://shop36-testb-a0u5doexwffx-959882810.us-east-1.elb.amazonaws.com/api/users/' + userId
		console.log('Sending DELETE request directly to:', apiUrl)
		
		try {
			const response = await fetch(apiUrl, {
				method: 'DELETE',
				headers: {
					'Authorization': authToken,
					'Content-Type': 'application/json'
				}
			})
			
			console.log('Delete user response status:', response.status)

			if (!response.ok) {
				let errorText = await response.text()
				console.error('Error from delete user endpoint:', errorText)
				
				return NextResponse.json({
					error: 'Failed to delete user',
					status: response.status,
					details: errorText
				}, { status: response.status })
			}
			
			return NextResponse.json({ success: true })
		} catch (error: any) {
			console.error('Error making delete user request:', error?.message || 'Unknown error')
			
			return NextResponse.json({
				error: 'Failed to delete user',
				details: error?.message || 'Unknown error'
			}, { status: 500 })
		}
	} catch (error: any) {
		console.error('Error in delete-user route:', error?.message || 'Unknown error')
		return NextResponse.json({ 
			error: 'Internal server error',
			details: error?.message || 'Unknown error'
		}, { status: 500 })
	}
} 