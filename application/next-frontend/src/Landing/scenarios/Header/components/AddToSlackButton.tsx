import Image from 'next/image'
import SlackLogoBlack from '@/Landing/assets/illustrations/SlackLogoBlack.svg'

const AddToSlackButton = () => {
    return (
        <button className="flex flex-row items-center gap-4 border-2 border-solid border-black bg-gray-50 p-2 hover:bg-gray-200">
            <Image src={SlackLogoBlack} width={30} alt="-" />
            <span>{'Get Started'}</span>
            <span>{'->'}</span>
        </button>
    )
}

export { AddToSlackButton }
