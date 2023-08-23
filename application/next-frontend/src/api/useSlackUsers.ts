import { useAuthedSWR } from './utils'

export interface SlackUser {
    active: boolean
    priority: number
    slack_id: string
    current_username: string
    first_seen: string
    email?: string
}

const useSlackUsers = () => {
    const { data, error, isLoading } = useAuthedSWR<SlackUser[]>('/users')

    return {
        data,
        isLoading,
        error,
    }
}

export default useSlackUsers
