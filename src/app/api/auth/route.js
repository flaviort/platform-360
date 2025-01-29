// this is just a fake endpoint

export const users = [
    { username: 'test@test.com', password: 'test' },
    { username: 'test2@test.com', password: 'test2' }
]
  
export async function POST(request) {
    try {
        const body = await request.json()
        const { Email, Password } = body
    
        const user = users.find((u) => u.username === Email)

        if (!user) {
            return new Response(
                JSON.stringify({ message: 'User not found' }),
                { status: 401 }
            )
        }
    
        if (user.password !== Password) {
            return new Response(
                JSON.stringify({ message: 'Incorrect password' }),
                { status: 401 }
            )
        }
    
        // success
        return new Response(
            JSON.stringify({ message: 'Login successful!' }),
            { status: 200 }
        )
        
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Bad request' }),
            { status: 400 }
        )
    }
}  