function getCookie(name: string) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts && parts.length === 2) return parts.pop()?.split(';')?.shift()
}

const baseUrl = process.env.BACKEND_URI ? `${process.env.BACKEND_URI.replace(/\/+$/, '')}/api` : '/api'

export async function fetcher<Data>(endpoint: URL) {
    const headers = new Headers()

    const cookie = getCookie('csrf_access_token')
    if (cookie) headers.set('X-CSRF-TOKEN', cookie)

    headers.set('Content-Type', 'application/json')

    return fetch(baseUrl + endpoint, {
        headers,
    })
        .then((res) => res.json())
        .then((res) => res.data as Data)
}
