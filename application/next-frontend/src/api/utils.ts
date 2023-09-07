import { clientsideApiUri } from './endpoints'

const getCookie = (name: string) => {
    if (typeof window !== 'undefined') {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts && parts.length === 2) return parts.pop()?.split(';')?.shift()
    }
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

const fetchData = async <Data>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: object) => {
    const options: RequestInit = {
        method: method,
        headers: configureHeaders(),
    }
    if (body) options.body = JSON.stringify(body)

    const res = await fetch(clientsideApiUri + endpoint, options)

    if (!res.ok) {
        const info = await res.json()
        const err = { statusCode: res.status, info }
        throw err
    }
    return res.json() as Data
}

export const apiRequestHelper = () => {
    /**
     * Should not be used directly, but through the useAuthedSWR hook
     */
    const get = async <Data>(endpoint: string) => {
        return await fetchData<Data>(endpoint, 'GET')
    }

    const put = async (endpoint: string, body: object) => {
        return await fetchData(endpoint, 'PUT', body)
    }

    const post = async (endpoint: string, body: object) => {
        return await fetchData(endpoint, 'POST', body)
    }

    const del = async (endpoint: string) => {
        return await fetchData(endpoint, 'DELETE')
    }

    return { get, put, post, del }
}
