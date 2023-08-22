import { CardComponent } from 'Admin/components/CardComponent'
import useUsers from '@/api/useUsers'

const Users = () => {
    const { data, isLoading, error } = useUsers()
    console.log(data)

    if (isLoading) {
        return (
            <CardComponent title="People" className="w-1/4">
                Loading...
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

    if (error) {
        return (
            <CardComponent title="People" className="w-1/4">
                Failed to load users, due to the following error: {error?.info.msg}
            </CardComponent>
        )
    }

    return (
        <CardComponent title="People" className="w-1/4">
            {data.map((user) => (
                <div key={user.slack_id} className="flex items-center justify-between py-2">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-black"></div>
                    <p className="ml-3">{user.current_username}</p>
                    <button className="ml-auto">&times;</button>
                </div>
            ))}
        </CardComponent>
    )
}

export { Users }
