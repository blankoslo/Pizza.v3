import Image from 'next/image'
import SlackLogo from '@/Landing/assets/illustrations/SlackLogo.svg'

const AddToSlackButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            className="flex w-[270px] justify-center border-[3px] border-b-[10px] border-green-primary bg-white
            py-2 text-green-primary hover:bg-green-secondary focus:outline-none"
            onClick={onClick}
        >
            <Image src={SlackLogo} width={30} alt="slack logo" />
            <span className="my-auto ml-3 text-2xl font-bold italic">Add to Slack</span>
        </button>
    )
}

export { AddToSlackButton }
