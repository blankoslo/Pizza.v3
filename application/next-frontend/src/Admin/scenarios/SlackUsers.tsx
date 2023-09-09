import { CardComponent } from 'Admin/components/CardComponent'
import { useSlackUsers } from '@/api/useSlackUsers'
import { Switch } from '@mui/material'

const SlackUsers = () => {
    const { data, isLoading, error, updateUser } = useSlackUsers()

    if (isLoading) {
        return <CardComponent title="People">Loading...</CardComponent>
    }

    if (error) {
        return (
            <CardComponent title="People">
                Failed to load users due to the following error: {error?.info.msg}
            </CardComponent>
        )
    }

    if (!data || data.length == 0) {
        return <CardComponent title="People">No users found.</CardComponent>
    }

    return (
        <CardComponent title="People">
            {data.map((slackUser) => (
                <div key={slackUser.slack_id} className="flex items-center justify-between py-2">
                    <Switch
                        checked={slackUser.active}
                        onChange={() => {
                            console.log(slackUser)
                            updateUser(slackUser)
                        }}
                        color="success"
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <p className="ml-3">{slackUser.current_username}</p>
                </div>
            ))}
        </CardComponent>
    )
}

export { SlackUsers }
