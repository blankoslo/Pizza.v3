import { useCurrentChannel } from '@/api/useCurrentChannel'
import { SlackUser } from '@/api/useSlackUsers'
import { CardComponentWrapper } from '../../components/CardComponentWrapper'
import { useHover } from '@/Shared/context/HoverContext'
import { SlackChannelModal } from './components/SlackChannelModal'
import { useModal } from '@/Shared/context/ModalContext'

const numUsersInChannel = (users: SlackUser[]) => {
    if (users.length === 0) return 'No users in channel'
    if (users.length === 1) return '1 user in channel'
    return `${users.length} users in channel`
}

const SlackChannel = () => {
    const { data, isLoading, error } = useCurrentChannel()

    const channelName = data?.channel_name
    const channelMembers = data?.users.filter((user) => user.active) ?? []
    const { isHovered } = useHover()

    const { openModal } = useModal()

    return (
        <CardComponentWrapper title="Slack Channel" onClickCard={() => openModal(<SlackChannelModal />)}>
            {isLoading ? (
                'Loading...'
            ) : error ? (
                `Failed to load channel info due to the following error: ${error?.info.msg}`
            ) : !data || !data.channel_id ? (
                <div className="flex max-w-[325px] flex-col pt-5 font-workSans">
                    No slack channel has been set for the PizzaBot. Please use the command{' '}
                    <b>/set&#8209;pizza&#8209;channel</b>
                    in your preferred slack-channel to set.
                </div>
            ) : (
                <div className="flex flex-col pt-5 font-workSans">
                    <span className="text-2xl font-semibold leading-10">
                        <span className={`px-3 ${isHovered ? 'marked-entry-card' : ''}`}>#{channelName}</span>
                    </span>
                    <span className="mt-4 pl-3">{numUsersInChannel(channelMembers)}</span>
                </div>
            )}
        </CardComponentWrapper>
    )
}

export { SlackChannel }
