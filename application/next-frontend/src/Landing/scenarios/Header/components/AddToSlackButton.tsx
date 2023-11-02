import Image from 'next/image'
import SlackLogoBlack from '@/Landing/assets/illustrations/SlackLogoBlack.svg'

const AddToSlackButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            className="flex flex-row items-center gap-4 border-2 border-solid border-black bg-gray-50 p-2 font-bold hover:bg-gray-200"
            onClick={onClick}
        >
            <Image src={SlackLogoBlack} width={30} alt="-" />
            <span>{'Add to Slack'}</span>
            <span>{'>'}</span>
        </button>
    )
}

export { AddToSlackButton }
