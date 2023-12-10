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
        <div className="flex w-full flex-1 flex-row bg-green-primary ">
            <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8 font-queensRegular text-white">
                <h1 className="max-w-lg text-center text-5xl font-bold">{header}</h1>
                <p className="max-w-lg text-center text-3xl ">{message}</p>
                <p className="max-w-lg text-center text-3xl ">{actionMessage}</p>
                <Link
                    href={'/'}
                    className="rounded-sm border border-green-secondary bg-green-800 px-8 py-2 text-white hover:bg-green-700"
                >
                    Go back
                </Link>
                <Image src={icon} alt="Pizzabot logo" width={400} height={400} />
            </div>
        </div>
    )
}

const SlackCallbackPageSuccess = ({ message }: { message?: string }) => {
    return (
        <SlackCallbackPage
            header={'The Pizza Bot has been added to Slack!'}
            message={message}
            actionMessage={'Check it out in Slack:)'}
            icon={MascotWithFourArms}
        />
    )
}

const SlackCallbackPageError = ({ message }: { message?: string }) => {
    return (
        <SlackCallbackPage
            header={'Error adding the pizzabot to slack...'}
            message={message}
            actionMessage={'Go back to the landing page to try again'}
            icon={MascotSad}
        />
    )
}

export { SlackCallbackPageSuccess, SlackCallbackPageError }
