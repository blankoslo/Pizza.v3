const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts && parts.length === 2) return parts.pop()?.split(';')?.shift()
}

export const baseUrl = process.env.BACKEND_URI ? `${process.env.BACKEND_URI.replace(/\/+$/, '')}/api` : '/api'
