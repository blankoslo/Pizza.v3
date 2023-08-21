import { useAuthedSWR } from './utils'

export interface ApiUser {
    active: boolean
    priority: number
    slack_id: string
    current_username: string
    first_seen: string
    email?: string
}

export default function useUsers() {
    const { data, error, isLoading } = useAuthedSWR<ApiUser[]>('/users')

    return {
        users: data,
        isLoading,
        isError: error,
    }
}
