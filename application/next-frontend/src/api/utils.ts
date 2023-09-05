import { useRouter } from 'next/router'
import useSWR from 'swr'
import { clientsideApiUri } from './endpoints'

export type FetcherError = {
    statusCode: number
    info: {
        msg: string
    }
}

const getCookie = (name: string) => {
    if (typeof window !== 'undefined') {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts && parts.length === 2) return parts.pop()?.split(';')?.shift()
    }
}

export const authedFetcher = async <Data>(endpoint: URL) => {
    const headers = new Headers()
    const cookie = getCookie('csrf_access_token')

    if (cookie) {
        headers.set('X-CSRF-TOKEN', cookie)
    }

    headers.set('Content-Type', 'application/json')
    const res = await fetch(clientsideApiUri + endpoint, { headers })

    if (!res.ok) {
        const info = await res.json()
        const err: FetcherError = { statusCode: res.status, info }
        throw err
    }

    return res.json() as Data
}

export const useAuthedSWR = <AuthedSWR>(endpoint: string) => {
    const { data, isLoading, error, mutate } = useSWR<AuthedSWR, FetcherError>(endpoint, authedFetcher)
    const router = useRouter()

    if (error) {
        if (error.statusCode === 401 || error.statusCode == 403) {
            router.push('/login')
        }
    }

    return { data, isLoading, error, mutate }
}

export const useMutater = () => {
    const headers = new Headers()
    const cookie = getCookie('csrf_access_token')

    if (cookie) {
        headers.set('X-CSRF-TOKEN', cookie)
    }

    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')

    const put = async <Data>(endpoint: string, body: Object) => {
        const res = await fetch(clientsideApiUri + endpoint, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body),
        })
        if (!res.ok) {
            const info = await res.json()
            const err: FetcherError = { statusCode: res.status, info }
            throw err
        }
        return res.json() as Data
    }

    return { put }
}
