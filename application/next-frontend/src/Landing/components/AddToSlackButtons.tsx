import Image from 'next/image'
import SlackLogo from '@/Landing/assets/illustrations/SlackLogo.svg'
import SlackLogoWhite from '@/Landing/assets/illustrations/SlackLogoWhite.svg'
import { clientsideApiUri } from '@/api/endpoints'

const addToSlack = async () => {
    const res = await fetch(clientsideApiUri + '/slack/install', { method: 'GET' }).then((res) => res.json())
    const redirectURL = res.redirect_url

    if (redirectURL) window.location.assign(redirectURL)
}

const AddToSlackButton = () => {
    return (
        <button
            className="flex w-[270px] justify-center border-[3px] border-b-[10px] border-green-primary bg-green-light 
            py-2 font-workSans font-bold italic text-green-primary hover:bg-green-secondary focus:outline-none"
            onClick={addToSlack}
        >
            <Image src={SlackLogo} width={30} alt="slack logo" />
            <span className="my-auto ml-3 text-2xl">Add to Slack</span>
        </button>
    )
}

const AddToSlackButtonWhite = () => {
    return (
        <button
            className="flex w-[270px] justify-center border-[3px] border-b-[10px] border-white bg-green-primary
            py-2 font-workSans font-bold italic text-white hover:bg-green-secondary focus:outline-none"
            onClick={addToSlack}
        >
            <Image src={SlackLogoWhite} width={30} alt="slack logo" />
            <span className="my-auto ml-3 text-2xl">Add to Slack</span>
        </button>
    )
}

const AddToSlackButtonWhiteRounded = () => {
    return (
        <button
            className="flex w-[270px] justify-center rounded-full
            bg-white py-4 font-workSans font-bold italic text-black hover:bg-green-secondary "
            onClick={addToSlack}
        >
            <Image src={SlackLogo} width={30} alt="slack logo" />
            <span className="my-auto ml-3 text-2xl">Add to Slack</span>
        </button>
    )
}

export { AddToSlackButton, AddToSlackButtonWhite, AddToSlackButtonWhiteRounded }
