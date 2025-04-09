import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { projectId } = body
        
        // console.log('Project delete request body:', body);
        
        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
        }
        
        const authToken = request.headers.get('Authorization')
        // console.log('Auth token:', authToken ? 'Present (not shown for security)' : 'Missing');
        
        if (!authToken) {
            return NextResponse.json({ error: 'Authorization is required' }, { status: 401 })
        }

        // console.log('Delete project API called with projectId:', projectId)
        
        // Direct delete request to the backend API
        const apiUrl = 'http://shop36-testb-a0u5doexwffx-959882810.us-east-1.elb.amazonaws.com/api/projects/' + projectId;
        // console.log('Sending DELETE request directly to:', apiUrl);
        
        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                }
            });
            
            // console.log('Delete project response status:', response.status);

            if (!response.ok) {
                let errorText = await response.text();
                console.error('Error from delete project endpoint:', errorText);
                
                return NextResponse.json({
                    error: 'Failed to delete project',
                    status: response.status,
                    details: errorText
                }, { status: response.status });
            }
            
            return NextResponse.json({ success: true });
        } catch (error: any) {
            console.error('Error making delete project request:', error?.message || 'Unknown error');
            
            return NextResponse.json({
                error: 'Failed to delete project',
                details: error?.message || 'Unknown error'
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Error in delete-project route:', error?.message || 'Unknown error');
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
} 