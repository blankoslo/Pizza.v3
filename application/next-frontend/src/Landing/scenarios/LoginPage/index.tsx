import { LoginButton } from '@/Shared/components/LoginButton'
import Image from 'next/image'
import MascotWithFourArms from 'Landing/assets/illustrations/MascotWithFourArms.svg'

const LoginPage = () => {
    return (
        <div className="flex h-full w-full flex-row">
            <div className="hidden h-full w-[40%] items-center justify-center bg-green-primary lg:flex lg:flex-col">
                <Image src={MascotWithFourArms} alt="Pizzabot logo" width={400} height={400} className="pb-16" />
            </div>
            <div className="flex h-full flex-1 flex-col items-center gap-8 font-workSans">
                <h1 className="pt-16 text-4xl font-bold text-green-primary">Welcome to Pizzabot</h1>
                <p className="text-xl text-green-primary">Please login to continue</p>
                <LoginButton className="border border-green-secondary bg-green-secondary px-8 py-4 hover:border-green-quaternary" />
                <Image
                    src={MascotWithFourArms}
                    alt="Pizzabot logo"
                    width={400}
                    height={400}
                    className="block lg:hidden"
                />
            </div>
        </div>
    )
}

export { LoginPage }
