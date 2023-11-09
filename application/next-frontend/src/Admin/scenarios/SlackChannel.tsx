import { CardComponent } from 'Admin/components/CardComponent'
import { useCurrentChannel } from '@/api/useCurrentChannel'
import { SlackUser } from '@/api/useSlackUsers'

const numUsersInChannel = (users: SlackUser[]) => {
    if (users.length === 0) return 'No users in channel'
    if (users.length === 1) return '1 user in channel'
    return `${users.length} users in channel`
}

const SlackChannel = () => {
    const { data, isLoading, error } = useCurrentChannel()

    const channelName = data?.channel_name
    const channelMembers = data?.users.filter((user) => user.active) ?? []

    return (
        <CardComponent title="Slack Channel">
            {isLoading ? (
                'Loading...'
            ) : error ? (
                `Failed to load channel info due to the following error: ${error?.info.msg}`
            ) : !data || channelName === undefined ? (
                <div className="mt-5 break-keep font-workSans">
                    No slack channel has been set for the PizzaBot. Please use the command
                    <b>/set&#8209;pizza&#8209;channel</b> in your preferred slack-channel to set.
                </div>
            ) : (
                <div className="mt-5 flex flex-col font-workSans">
                    <h2 className="font-semibold italic text-green-primary">Slack Channel:</h2>
                    <span className="text-2xl font-semibold leading-10">#{channelName}</span>
                    <span className="mt-4">{numUsersInChannel(channelMembers)}</span>
                </div>
            )}
        </CardComponent>
    )
}

export { SlackChannel }
