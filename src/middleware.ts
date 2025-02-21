// libraries
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')
    const isAuthPage = request.nextUrl.pathname.startsWith('/account')
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

    if (isDashboardPage && !token) {
        return NextResponse.redirect(new URL('/account/login', request.url))
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard/my-reports', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/account/:path*']
} 