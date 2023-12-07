import Image from 'next/image'
import MascotWithFourArms from 'Landing/assets/illustrations/MascotWithFourArms.svg'
import MascotSad from 'Landing/assets/illustrations/MascotSad.svg'
import Link from 'next/link'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'

const SlackCallbackPage = ({
    header,
    message,
    actionMessage,
    icon,
}: {
    header: string
    message?: string
    actionMessage: string
    icon: StaticImport
}) => {
    return (
        <div className="flex w-full flex-1 flex-row">
            <div className="hidden w-[40%] items-center justify-center bg-green-primary lg:flex lg:flex-col">
                <Image src={icon} alt="Pizzabot logo" width={400} height={400} className="" />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8 font-workSans">
                <h1 className=" max-w-lg text-center text-4xl font-bold text-green-primary">{header}</h1>
                <p className="max-w-lg text-center text-xl text-green-primary">{message}</p>
                <p className="max-w-lg text-center text-xl text-green-primary">{actionMessage}</p>
                <Link href={'/'} className="w-fit border border-green-primary px-8 py-2 hover:bg-slate-300">
                    Go Back
                </Link>
                <Image src={icon} alt="Pizzabot logo" width={400} height={400} className="block lg:hidden" />
            </div>
        </div>
    )
}

const SlackCallbackPageSuccess = ({ message }: { message?: string }) => {
    return (
        <SlackCallbackPage
            header={'Thanks for adding the PizzaBot!'}
            message={message}
            actionMessage={'I have sent you a DM to greet you. Check it out!'}
            icon={MascotWithFourArms}
        />
    )
}

const SlackCallbackPageError = ({ message }: { message?: string }) => {
    return (
        <SlackCallbackPage
            header={'Error adding the pizzabot'}
            message={message}
            actionMessage={'Go back to try again'}
            icon={MascotSad}
        />
    )
}

export { SlackCallbackPageSuccess, SlackCallbackPageError }
