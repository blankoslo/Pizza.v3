import { fetcher } from './utils'
import useSWR from 'swr'

export default function useUsers() {
    const { data, error, isLoading } = useSWR('/users', fetcher)

    return {
        users: data,
        isLoading,
        isError: error,
    }
}
