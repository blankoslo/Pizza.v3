27import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

type Environment = 'production' | 'development' | 'test'
export function middleware(req: NextRequest, ev: NextFetchEvent) {
    console.log('protocol: ', req.nextUrl.protocol)
    console.log('header: ', req.headers.get('x-forwarded-proto'))

    const currentEnv: Environment = process.env.NODE_ENV
    if (
        currentEnv === 'production' &&
        (req.headers.get('x-forwarded-proto') !== 'https' || req.nextUrl.protocol !== 'https')
    ) {
        return NextResponse.redirect(`https://${req.headers.get('host')}${req.nextUrl.pathname}`, 301)
    }
    return NextResponse.next()
}
