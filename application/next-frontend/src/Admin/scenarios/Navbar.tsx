import { useRouter } from 'next/router'
import { apiRequestHelper } from '@/api/utils'
import { useState } from 'react'
import Image from 'next/image'
import PizzaBotLogo from 'Admin/assets/PizzaBotLogo.svg'

const Navbar = () => {
    const router = useRouter()
    const [markedIndex, setMarkedIndex] = useState(2)

    const logout = async () => {
        try {
            const res = await apiRequestHelper.del<{ msg: string }>('/auth/logout')
            if (res) router.push('/login')
        } catch (err) {
            console.error(err)
        }
    }

    const navbarEntries = [
        {
            text: 'Help',
            key: 0,
        },
        {
            text: 'Policy',
            key: 1,
        },
        {
            text: 'Admin',
            key: 2,
        },
    ]

    return (
        <div className="flex w-full items-center gap-4 overflow-hidden bg-white py-4 font-workSans text-xl text-dark">
            <div className="ml-16 flex-1">
                <Image priority src={PizzaBotLogo} width={150} alt="pizza bot logo" />
            </div>
            {navbarEntries.map((entry) => (
                <button
                    key={entry.key}
                    className={`mr-10 hover:font-bold hover:text-green-primary ${
                        entry.key == markedIndex ? 'marked-entry font-bold text-green-primary' : ''
                    }`}
                    onClick={() => setMarkedIndex(entry.key)}
                >
                    {entry.text}
                </button>
            ))}
            <button className="mr-10 hover:font-bold hover:text-green-primary" onClick={() => logout()}>
                Log out
            </button>
        </div>
    )
}

export { Navbar }
