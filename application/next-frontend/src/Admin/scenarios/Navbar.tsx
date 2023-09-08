import { useRouter } from 'next/router'
import { User } from '../types/User'

const Navbar = ({ user }: { user: User }) => {
    const router = useRouter()

    const logout = async () => {
        const res = await fetch('/auth/logout') // TODO: change to apihelper delete method

        if (res.ok) router.push('/login')
    }
    return (
        <div className="flex w-full items-center gap-4 overflow-hidden bg-teal-400 px-8 py-4 text-gray-700">
            <div className="flex-1">Logged in as {user.name}</div>
            <button className="m-auto w-fit border border-black px-8 py-2 hover:bg-slate-300" onClick={logout}>
                Logout
            </button>
        </div>
    )
}

export { Navbar }
