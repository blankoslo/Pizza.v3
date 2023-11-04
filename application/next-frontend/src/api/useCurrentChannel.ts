import { useAuthedSWR } from './useAuthedSWR'
import type { SlackUser } from './useSlackUsers'

export type ApiCurrentChannelInfo = {
    channel_name: string
    users: SlackUser[]
}

const useCurrentChannel = () => {
    const endpoint = '/users/current-channel'

    const { data, isLoading, error } = useAuthedSWR<ApiCurrentChannelInfo>(endpoint)

    return { data, isLoading, error }
}

export { useCurrentChannel }
