import { CardComponent } from 'Admin/components/CardComponent'
import useSlackUsers from '@/api/useSlackUsers'
import { Button, Checkbox } from '@mui/material'

const SlackUsers = () => {
    const { data, isLoading, error, updateUser } = useSlackUsers()

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

    const updateuser = async () => {
        const exmpUser = data[0]
        updateUser({ ...exmpUser, active: !exmpUser.active })
        console.log(data)
    }

    return (
        <CardComponent title="People" className="w-1/4">
            {data.map((slackUser) => (
                <div key={slackUser.slack_id} className="flex items-center justify-between py-2">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-black"></div>
                    <p className="ml-3">{slackUser.current_username}</p>
                    <Checkbox checked={slackUser.active}></Checkbox>
                    <button className="ml-auto">&times;</button>
                </div>
            ))}
            <Button onClick={() => updateuser()}>Modify first user active status</Button>
        </CardComponent>
    )
}

export { SlackUsers }
