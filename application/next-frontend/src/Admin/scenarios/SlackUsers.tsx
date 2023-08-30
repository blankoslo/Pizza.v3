import { CardComponent } from 'Admin/components/CardComponent'
import useSlackUsers from '@/api/useSlackUsers'

const SlackUsers = () => {
    const { data, isLoading, error } = useSlackUsers()

    if (isLoading) {
        return (
            <CardComponent title="People" className="w-1/4">
                Loading...
            </CardComponent>
        )
    }

    if (error) {
        return (
            <CardComponent title="People" className="w-1/4">
                Failed to load users due to the following error: {error?.info.msg}
            </CardComponent>
        )
    }

    if (!data || data.length == 0) {
        return (
            <CardComponent title="People" className="w-1/4">
                No users found.
            </CardComponent>
        )
    }

    return (
        <CardComponent title="People" className="w-1/4">
            {data.map((slackUser) => (
                <div key={slackUser.slack_id} className="flex items-center justify-between py-2">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-black"></div>
                    <p className="ml-3">{slackUser.current_username}</p>
                    <button className="ml-auto">&times;</button>
                </div>
            ))}
        </CardComponent>
    )
}

export { SlackUsers }
