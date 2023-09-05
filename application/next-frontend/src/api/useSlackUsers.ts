import { useAuthedSWR, useMutater } from './utils'

export interface SlackUser {
    active: boolean
    priority: number
    slack_id: string
    current_username: string
    first_seen: string
    email?: string
}

const useSlackUsers = () => {
    const endpoint = '/users'

    const { data, isLoading, error, mutate } = useAuthedSWR<SlackUser[]>(endpoint)

    const { put } = useMutater()

    const updateUser = (updatedUser: SlackUser) => {
        //for some reason the backend only accepts the active property
        const updatedUserActiveStatus = { active: updatedUser.active }

        try {
            mutate(
                async () => {
                    const user = await put(endpoint + '/' + updatedUser.slack_id, updatedUserActiveStatus)

                    if (data) {
                        const filteredData = data?.filter((user) => user.slack_id !== updatedUser.slack_id)
                        return [...filteredData, user]
                    }
                },
                {
                    rollbackOnError: true,
                    throwOnError: true,
                },
            )
        } catch (e) {
            console.error(e)
        }
    }

    return { data, isLoading, error, updateUser }
}

export default useSlackUsers
