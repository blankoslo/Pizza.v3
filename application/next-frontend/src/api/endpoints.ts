if (!process.env.NODE_ENV) throw new Error('Missing enviroment variable NODE_ENV')
if (!process.env.NEXT_PUBLIC_BACKEND_URI) throw new Error('Missing enviroment variable BACKEND_URI')

export const clientsideApiUri =
    process.env.NODE_ENV === 'development' ? '/api' : process.env.NEXT_PUBLIC_BACKEND_URI.replace(/\/+$/, '')

export const serversideApiUri = process.env.NEXT_PUBLIC_BACKEND_URI.replace(/\/+$/, '') + '/api'
