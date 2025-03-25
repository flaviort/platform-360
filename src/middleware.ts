// libraries
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')
    const isAuthPage = request.nextUrl.pathname.startsWith('/account') && 
        !request.nextUrl.pathname.startsWith('/account/settings')
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

    if (isDashboardPage && !token) {
        return NextResponse.redirect(new URL('/account/login', request.url))
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard/my-reports', request.url))
    }

    // Add authorization header to all API requests
    if (request.nextUrl.pathname.startsWith('/api/') && token) {
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('Authorization', `Bearer ${token.value}`)
        
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/account/:path*',
        '/api/:path*'
    ],
} 