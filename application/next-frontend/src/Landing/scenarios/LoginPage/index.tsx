import { LoginButton } from '@/Shared/components/LoginButton'
import Image from 'next/image'
import MascotWithFourArms from 'Landing/assets/illustrations/MascotWithFourArms.svg'

const LoginPage = () => {
    return (
        <div className="flex w-full flex-1 flex-row">
            <div className="hidden w-[40%] items-center justify-center bg-green-primary lg:flex lg:flex-col">
                <Image src={MascotWithFourArms} alt="Pizzabot logo" width={400} height={400} className="" />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8 font-workSans">
                <h1 className="text-4xl font-bold text-green-primary">Welcome to Pizzabot</h1>
                <p className="text-xl text-green-primary">Please login to continue</p>
                <LoginButton className="w-fit border border-green-primary px-8 py-2 hover:bg-slate-300" />
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
