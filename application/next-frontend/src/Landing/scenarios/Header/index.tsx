import Image from 'next/image'
import PizzaBotTitle from '@/Landing/assets/illustrations/PizzaBotTitle.svg'
import { AddToSlackButton } from './components/AddToSlackButton'

const Header = () => {
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
                <AddToSlackButton />
            </nav>
        </>
    )
}

export { Header }
