import Image from 'next/image'
import PizzaBotLogo from '@/Landing/assets/illustrations/PizzaBotLogo.svg'
import { LoginButton } from '@/Shared/components/LoginButton'

const Header = () => {
    return (
        <div className="sticky top-0 z-50 flex w-full items-center gap-4 overflow-hidden bg-green-light py-4 after:top-0">
            <div className="ml-16 flex-1">
                <Image priority src={PizzaBotLogo} width={150} alt="pizza bot logo" />
            </div>
            <LoginButton />
        </div>
    )
}

export { Header }
