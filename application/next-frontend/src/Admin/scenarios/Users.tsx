import { CardComponent } from 'Admin/components/CardComponent'

interface SlackUser {
    name: string
    picturePath?: string
    id: string
}

// static data, only temp
const slackUserList: SlackUser[] = [
    {
        name: 'User 1',
        id: '1',
    },
    {
        name: 'User 2',
        id: '2',
    },
    {
        name: 'User 3',
        id: '3',
    },
]

const Users = () => {
    return (
        <CardComponent title="People" className="w-1/4">
            {slackUserList.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-black"></div>
                    <p className="ml-3">{user.name}</p>
                    <button className="ml-auto">&times;</button>
                </div>
            ))}
        </CardComponent>
    )
}

export { Users }
