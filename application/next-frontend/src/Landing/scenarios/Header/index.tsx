import Image from 'next/image'
import PizzaBotLogo from '@/Landing/assets/illustrations/PizzaBotLogo.svg'
import { LoginButton } from '@/Shared/components/LoginButton'
import { useRouter } from 'next/router'

const Header = () => {
    const router = useRouter()

    const routeToRoot = () => {
        router.push('/')
    }

    return (
        <>
            <div className="top-0 z-50 flex h-[10vh] w-full items-center gap-4 overflow-hidden bg-green-tertiary py-4">
                <div className="ml-16 flex-1">
                    <Image
                        priority
                        src={PizzaBotLogo}
                        width={150}
                        alt="pizza bot logo"
                        onClick={routeToRoot}
                        className="hover:cursor-pointer hover:outline-dashed hover:outline-green-secondary"
                    />
                </div>
                <LoginButton />
            </div>
            {/* This is a placeholder for the header so that the content doesn't get hidden behind the header */}
            <div className="h-16 w-full bg-green-light"></div>
        </>
    )
}

export { Header }
