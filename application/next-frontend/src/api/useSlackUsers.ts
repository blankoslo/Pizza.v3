import { useAuthedSWR, mutater } from './utils'

export interface SlackUser {
    active: boolean
    priority: number
    slack_id: string
    current_username: string
    first_seen: string
    email?: string
}

export interface BaseUser {
    active: boolean
    priorty: number
}

const useSlackUsers = () => {
    const endpoint = '/users'

    const { data, isLoading, error, mutate } = useAuthedSWR<SlackUser[]>(endpoint)

    const { put } = mutater()

    const updateUser = (updatedUser: SlackUser) => {
        const updatedBaseUSer: BaseUser = { active: updatedUser.active, priorty: updatedUser.priority }

        try {
            mutate(async () => {
                const user = await put(endpoint + '/' + updatedUser.slack_id, updatedBaseUSer)

                if (data) {
                    const filteredData = data?.filter((user) => user.slack_id !== updatedUser.slack_id)
                    return [...filteredData, user]
                }
            })
        } catch (e) {
            console.error(e)
        }
    }

    return { data, isLoading, error, updateUser }
}

export default useSlackUsers
