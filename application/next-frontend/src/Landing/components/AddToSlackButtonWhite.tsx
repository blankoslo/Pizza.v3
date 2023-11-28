import Image from 'next/image'
import SlackLogoWhite from '@/Landing/assets/illustrations/SlackLogoWhite.svg'

const AddToSlackButtonWhite = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            className="flex w-[270px] justify-center border-[3px] border-b-[10px] border-white bg-green-primary
            py-2 text-white hover:bg-green-secondary focus:outline-none"
            onClick={onClick}
        >
            <Image src={SlackLogoWhite} width={30} alt="slack logo" />
            <span className="my-auto ml-3 text-2xl font-bold italic">Add to Slack</span>
        </button>
    )
}

export { AddToSlackButtonWhite }
