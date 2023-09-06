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

export const useAuthedSWR = <Data>(endpoint: string) => {
    const { get } = mutater()
    const { data, isLoading, error, mutate } = useSWR<Data, FetcherError>(endpoint, get)
    const router = useRouter()

    if (error) {
        if (error.statusCode === 401 || error.statusCode == 403) {
            router.push('/login')
        }
    }

    return { data, isLoading, error, mutate }
}

const configureHeaders = () => {
    const headers = new Headers()
    const cookie = getCookie('csrf_access_token')

    if (cookie) {
        headers.set('X-CSRF-TOKEN', cookie)
    }

    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')

    return headers
}

const fetchData = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: object) => {
    const options: RequestInit = {
        method: method,
        headers: configureHeaders(),
    }
    if (body) options.body = JSON.stringify(body)

    return await fetch(clientsideApiUri + endpoint, options)
}

const handleHttpResponse = async <Data>(res: Response) => {
    if (!res.ok) {
        const info = await res.json()
        const err = { statusCode: res.status, info }
        throw err
    }
    return res.json() as Data
}

export const mutater = () => {
    /**
     * Should not be used directly, but through the useAuthedSWR hook
     */
    const get = async <Data>(endpoint: string) => {
        const res = await fetchData(endpoint, 'GET')
        return handleHttpResponse<Data>(res)
    }

    const put = async (endpoint: string, body: object) => {
        const res = await fetchData(endpoint, 'PUT', body)
        return handleHttpResponse(res)
    }

    const post = async (endpoint: string, body: object) => {
        const res = await fetchData(endpoint, 'POST', body)
        return handleHttpResponse(res)
    }

    const del = async (endpoint: string) => {
        const res = await fetchData(endpoint, 'DELETE')
        return await handleHttpResponse(res)
    }

    return { get, put, post, del }
}
