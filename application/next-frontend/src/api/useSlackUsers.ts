import { apiRequestHelper } from './utils'
import { useAuthedSWR } from './useAuthedSWR'

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
    priority: number
}

const useSlackUsers = () => {
    const endpoint = '/users'

    const { data, isLoading, error, mutate } = useAuthedSWR<SlackUser[]>(endpoint)

    const { put } = apiRequestHelper

    const updateUser = (updatedUser: SlackUser) => {
        const updatedBaseUser: BaseUser = { active: updatedUser.active, priority: updatedUser.priority }

        try {
            mutate(async () => {
                const user = await put<SlackUser>(endpoint + '/' + updatedUser.slack_id, updatedBaseUser)

                if (data) {
                    const updatedData = data.map((oldUser) => {
                        if (user && user.slack_id === oldUser.slack_id) return user
                        return oldUser
                    })
                    return updatedData
                }
            })
        } catch (e) {
            console.error(e)
        }
    }

    return { data, isLoading, error, updateUser }
}

export default useSlackUsers
