import { apiRequestHelper, cacheFormatHelper } from './utils'
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
    const { updateInCache } = cacheFormatHelper

    const updateUser = (updatedUser: SlackUser) => {
        const updatedBaseUser: BaseUser = { active: updatedUser.active, priority: updatedUser.priority }

        try {
            mutate(async () => {
                const user = await put<SlackUser>(endpoint + '/' + updatedUser.slack_id, updatedBaseUser)
                return updateInCache(data, user, (user) => user.slack_id)
            })
        } catch (e) {
            console.error(e)
        }
    }

    return { data, isLoading, error, updateUser }
}

export default useSlackUsers
