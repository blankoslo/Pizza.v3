import { useRouter } from 'next/router'
import useSWR from 'swr'
import { apiRequestHelper } from './utils'

export type FetcherError = {
    statusCode: number
    info: {
        msg: string
    }
}

export const useAuthedSWR = <Data>(endpoint: string) => {
    const { data, isLoading, error, mutate } = useSWR<Data, FetcherError>(endpoint, apiRequestHelper.get)
    const router = useRouter()

    if (error) {
        if (error.statusCode === 401 || error.statusCode == 403) {
            router.push('/login')
        }
    }
    return { data, isLoading, error, mutate }
}