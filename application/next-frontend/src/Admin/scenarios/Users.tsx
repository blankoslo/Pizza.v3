import CardComponent from 'Admin/components/CardComponent'

interface SlackUser {
    name: string
    picturePath?: string
}

// static data, only temp
const slackUsersList: SlackUser[] = [
    {
        name: 'User 1',
    },
    {
        name: 'User 2',
    },
    {
        name: 'User 3',
    },
]

const Users = () => {
    return (
        <CardComponent title="People" className="w-1/4">
            {slackUsersList.map((user: SlackUser, index: number) => (
                <div key={index} className="flex items-center justify-between py-2">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-black"></div>
                    <p className="ml-3">{user.name}</p>
                    <button className="ml-auto">&times;</button>
                </div>
            ))}
        </CardComponent>
    )
}

export default Users
