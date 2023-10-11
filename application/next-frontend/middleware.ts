import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

type Environment = 'production' | 'development' | 'test'
export function middleware(req: NextRequest, ev: NextFetchEvent) {
    const currentEnv: Environment = process.env.NODE_ENV
    if (currentEnv === 'production' && req.nextUrl.protocol !== 'https:') {
        return NextResponse.redirect(`https://${req.headers.get('host')}${req.nextUrl.pathname}`, 301)
    }
    return NextResponse.next()
}
