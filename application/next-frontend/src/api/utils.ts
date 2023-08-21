import { useRouter } from 'next/router'
import useSWR from 'swr'

export type FetcherError = {
    statusCode: number
    info: {
        msg: string
    }
}

function getCookie(name: string) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts && parts.length === 2) return parts.pop()?.split(';')?.shift()
}

export const baseUrl = process.env.BACKEND_URI ? `${process.env.BACKEND_URI.replace(/\/+$/, '')}/api` : '/api'

export async function authedFetcher<Data>(endpoint: URL) {
    const headers = new Headers()

    const cookie = getCookie('csrf_access_token')
    if (cookie) headers.set('X-CSRF-TOKEN', cookie)

    headers.set('Content-Type', 'application/json')

    const res = await fetch(baseUrl + endpoint, {
        headers,
    })

    if (!res.ok) {
        const err: FetcherError = {
            statusCode: res.status,
            info: await res.json(),
        }
        throw err
    }

    return (await res.json()) as Data
}

export const useAuthedSWR = <Data>(endpoint: string) => {
    const returned = useSWR<Data, FetcherError>(endpoint, authedFetcher)
    const router = useRouter()

    if (returned.error?.statusCode === 401 || returned.error?.statusCode === 403) router.push('/login')

    return returned
}
