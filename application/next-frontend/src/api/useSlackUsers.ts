import { apiRequestHelper } from './utils'
import { useAuthedSWR } from './useAuthedSWR'

export interface BaseSlackUser {
    active: boolean
    priority: number
}

export interface SlackUser extends BaseSlackUser {
    slack_id: string
    current_username: string
    first_seen: string
    email?: string
}

const useSlackUsers = () => {
    const endpoint = '/users'

    const { data, isLoading, error, mutate } = useAuthedSWR<SlackUser[]>(endpoint)

    const { put } = apiRequestHelper

    const updateUser = (userToUpdate: SlackUser) => {
        const updatedBaseUser: BaseSlackUser = { active: !userToUpdate.active, priority: userToUpdate.priority }

        try {
            mutate(
                async () => {
                    const user = await put<SlackUser>(endpoint + '/' + userToUpdate.slack_id, updatedBaseUser)

                    if (data) {
                        // Update cache
                        const updatedData = data.map((oldUser) => {
                            if (user.slack_id === oldUser.slack_id) return user
                            return oldUser
                        })
                        return updatedData
                    }
                },
                {
                    populateCache: true,
                    rollbackOnError: true,
                    revalidate: false, //dont revalidate since cache is updated
                },
            )
        } catch (e) {
            console.error(e)
        }
    }

    return { data, isLoading, error, updateUser }
}

export { useSlackUsers }
