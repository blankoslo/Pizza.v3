import { CardComponent } from 'Admin/components/CardComponent'
import useUsers from '@/api/useUsers'

const Users = () => {
    const { users, isLoading, isError } = useUsers()
    console.log(users)

    if (isLoading) {
        return (
            <CardComponent title="People" className="w-1/4">
                Loading...
            </CardComponent>
        )
    }
    if (isError || !users) {
        return <div>{`Kunne ikke laste Brukere: ${isError?.info}`}</div>
    }

    return (
        <CardComponent title="People" className="w-1/4">
            {users.map((user) => (
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
