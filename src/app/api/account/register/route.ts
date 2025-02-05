// this is just a fake endpoint
export async function POST(request: Request) {
    try {
        const body = await request.json()
    
        // success
        return new Response(
            JSON.stringify({ message: 'Email sent!' }),
            { status: 200 }
        )
        
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Bad request' }),
            { status: 400 }
        )
    }
}  