// this is just a fake endpoint
import { users } from './users'
  
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body
    
        const user = users.find((u) => u.username === email)

        if (!user) {
            return new Response(
                JSON.stringify({ message: 'User not found' }),
                {
                    status: 401,
                    statusText: 'User not found'
                }
            )
        }
    
        if (user.password !== password) {
            return new Response(
                JSON.stringify({ message: 'Incorrect password' }),
                {
                    status: 401,
                    statusText: 'Incorrect password'
                }
            )
        }
    
        // success
        return new Response(
            JSON.stringify({ 
                message: 'Login successful!',
                user: {
                    email: user.username
                }
            }),
            { status: 200 }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Bad request' }),
            { status: 400 }
        )
    }
}