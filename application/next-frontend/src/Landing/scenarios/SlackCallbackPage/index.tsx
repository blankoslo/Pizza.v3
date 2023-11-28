import Image from 'next/image'
import MascotWithFourArms from 'Landing/assets/illustrations/MascotWithFourArms.svg'
import MascotSad from 'Landing/assets/illustrations/MascotSad.svg'
import Link from 'next/link'

const SlackCallbackPageSuccess = ({ message }: { message?: string }) => {
    return (
        <div className="flex w-full flex-1 flex-row">
            <div className="hidden w-[40%] items-center justify-center bg-green-primary lg:flex lg:flex-col">
                <Image src={MascotWithFourArms} alt="Pizzabot logo" width={400} height={400} className="" />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 font-workSans">
                <h1 className=" max-w-lg text-center text-4xl font-bold text-green-primary">
                    Thanks for installing the PizzaBot!
                </h1>
                <p className="max-w-lg text-center text-xl text-green-primary">{message}</p>
                <p className="max-w-lg text-center text-xl text-green-primary">
                    {'I have sent you a DM to greet you. Check it out!'}
                </p>
                <Link href={'/'} className="w-fit border border-green-primary px-8 py-2 hover:bg-slate-300">
                    Go Back
                </Link>
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

const SlackCallbackPageError = ({ message }: { message?: string }) => {
    return (
        <div className="flex w-full flex-1 flex-row">
            <div className="hidden w-[40%] items-center justify-center bg-green-primary lg:flex lg:flex-col">
                <Image src={MascotSad} alt="Pizzabot logo" width={400} height={400} className="" />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 font-workSans">
                <h1 className="max-w-lg text-center text-4xl font-bold text-green-primary">
                    Error installing the pizzabot
                </h1>
                <p className="max-w-lg text-center text-xl text-red">{message || 'Unknown error occured!'}</p>
                <p className="max-w-lg text-center text-xl text-green-primary">Go back to try again</p>
                <Link href={'/'} className="w-fit border border-green-primary px-8 py-2 hover:bg-slate-300">
                    Go Back
                </Link>
                <Image src={MascotSad} alt="Pizzabot logo" width={400} height={400} className="block lg:hidden" />
            </div>
        </div>
    )
}

export { SlackCallbackPageSuccess, SlackCallbackPageError }
