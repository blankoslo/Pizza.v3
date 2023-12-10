import { LoginButton } from '@/Shared/components/LoginButton'
import Image from 'next/image'
import MascotWithFourArms from 'Landing/assets/illustrations/MascotWithFourArms.svg'

const LoginPage = () => {
    return (
        <div className="flex w-full flex-1 flex-row bg-green-primary">
            <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8 font-queensRegular text-white">
                <h1 className="text-5xl font-bold ">Welcome to Pizzabot!</h1>
                <p className="text-3xl ">Please login to continue</p>
                <LoginButton className="rounded-sm border border-green-secondary bg-green-800 px-8 py-2 font-semibold text-white hover:bg-green-700" />
                <Image src={MascotWithFourArms} alt="Pizzabot logo" width={400} height={400} />
            </div>
        </div>
    )
}

export { LoginPage }
