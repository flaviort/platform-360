// this is just a fake endpoint
import { emails } from './emails'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { Email } = body
            
        const email = emails.find((e) => e.email === Email)

        if (!email) {
            return new Response(
                JSON.stringify({ message: 'Email not found' }),
                { status: 401 }
            )
        }
    
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