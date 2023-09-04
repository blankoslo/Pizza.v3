if (!process.env.NODE_ENV) throw new Error('Missing enviroment variable NODE_ENV')
if (!process.env.NEXT_PUBLIC_BACKEND_URI) throw new Error('Missing enviroment variable NEXT_PUBLIC_BACKEND_URI')

/**
 * For use in clientside functionality.
 * In dev mode, api is routed through nginx with path /api
 */
export const clientsideApiUri =
    process.env.NODE_ENV === 'development' ? '/api' : process.env.NEXT_PUBLIC_BACKEND_URI.replace(/\/+$/, '')

/**
 * For use in serverside functionality.
 * In dev mode, next serverside fetch calls is not routed with nginx and goes directly to backend
 */
export const serversideApiUri = process.env.NEXT_PUBLIC_BACKEND_URI.replace(/\/+$/, '') + '/api'
