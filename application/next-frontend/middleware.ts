import { NextRequest, NextResponse } from 'next/server'

type Environment = 'production' | 'development' | 'test'
export function middleware(req: NextRequest) {
    const currentEnv: Environment = process.env.NODE_ENV
    /* quickfix: disallow http connection in prod */
    if (currentEnv === 'production' && req.nextUrl.protocol !== 'https:') {
        return NextResponse.redirect(`https://${req.headers.get('host')}${req.nextUrl.pathname}`, 301)
    }
    return NextResponse.next()
}
