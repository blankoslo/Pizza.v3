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
    return useAuthedSWR<SlackUser[]>('/users')
}

export default useSlackUsers
