import { useAuthedSWR } from './utils'

export interface ApiUser {
    active: boolean
    priority: number
    slack_id: string
    current_username: string
    first_seen: string
    email?: string
}

const useUsers = () => {
    const { data, error, isLoading } = useAuthedSWR<ApiUser[]>('/users')

    return {
        data,
        isLoading,
        error,
    }
}

export default useUsers
