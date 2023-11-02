import Image from 'next/image'
import PizzaBotTitle from '@/Landing/assets/illustrations/PizzaBotTitle.svg'
import { AddToSlackButton } from './components/AddToSlackButton'
import { clientsideApiUri } from '@/api/endpoints'
import { LoginButton } from '@/Shared/components/LoginButton'

const Header = () => {
    const addToSlack = async () => {
        const res = await fetch(clientsideApiUri + '/slack/install', { method: 'GET' }).then((res) => res.json())
        const redirectURL = res.redirect_url

        if (redirectURL) window.location.assign(redirectURL)
    }
    return (
        <>
            <div className="header !static"></div>
            <nav className="header flex flex-row items-center gap-8">
                <div className="flex-1">
                    <Image src={PizzaBotTitle} width={300} alt="Pizza Bot" />
                </div>
                <div>
                    <button className="p-4 font-bold hover:bg-gray-300">About us</button>
                </div>
                <LoginButton />
                <AddToSlackButton onClick={addToSlack} />
            </nav>
        </>
    )
}

export { Header }
