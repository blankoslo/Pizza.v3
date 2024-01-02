import { CardComponentWrapper } from '@/Admin/components/CardComponentWrapper'
import { HoverProvider } from '@/Shared/context/HoverContext'
import { useCurrentChannel } from '@/api/useCurrentChannel'
import { SlackUser } from '@/api/useSlackUsers'

const numUsersInChannel = (users: SlackUser[]) => {
    if (users.length === 0) return 'No users in channel'
    if (users.length === 1) return '1 user in channel'
    return `${users.length} users in channel`
}

const SlackChannelModal = () => {
    const { data, isLoading, error } = useCurrentChannel()

    const channelName = data?.channel_name
    const channelMembers = data?.users.filter((user) => user.active) ?? []

    return (
        <HoverProvider isInsideModal>
            <CardComponentWrapper title="Slack Channel" className="max-w-xl">
                {isLoading ? (
                    'Loading...'
                ) : error ? (
                    `Failed to load channel info due to the following error: ${error?.info.msg}`
                ) : !data || !data.channel_id ? (
                    <div className="mt-5 break-keep font-workSans">
                        No slack channel has been set for the PizzaBot. Please use the command{' '}
                        <b>/set&#8209;pizza&#8209;channel</b> in your preferred slack-channel to set.
                    </div>
                ) : (
                    <div className="mt-5 flex flex-col gap-4 pl-3 font-workSans">
                        <div className="text-2xl font-semibold">
                            <span>#{channelName}</span>
                        </div>
                        <div className="text-xl">{numUsersInChannel(channelMembers)}</div>
                        <div className="my-8 break-keep text-xl">
                            If you want to change the channel I work in, use the command{' '}
                            <b>/set&#8209;pizza&#8209;channel</b> in your preferred slack-channel to set.
                        </div>
                    </div>
                )}
            </CardComponentWrapper>
        </HoverProvider>
    )
}

export { SlackChannelModal }
