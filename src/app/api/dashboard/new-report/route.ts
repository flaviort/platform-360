// this is just a fake endpoint
export async function POST(request: Request) {
    try {
        const body = await request.json()

         // log the received data
         console.log('Received data:', body)
    
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