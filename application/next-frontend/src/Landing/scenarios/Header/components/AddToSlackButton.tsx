import Image from 'next/image'
import SlackLogoBlack from '@/Landing/assets/illustrations/SlackLogoBlack.svg'
import { useRouter } from 'next/router'

const AddToSlackButton = () => {
    const router = useRouter()
    const downloadUrl =
        'https://slack.com/oauth/v2/authorize?client_id=5747545588581.5774194036784&scope=channels:history,channels:read,channels:join,channels:manage,groups:read,chat:write,files:read,im:history,im:write,users:read,users:read.email,commands&user_scope='

    const pushDownload = () => {
        router.push(downloadUrl)
    }

    return (
        <button
            className="flex flex-row items-center gap-4 border-2 border-solid border-black bg-gray-50 p-2 font-bold text-black hover:bg-gray-200"
            onClick={() => {
                pushDownload()
            }}
        >
            <Image src={SlackLogoBlack} width={30} alt="-" />
            <span>{'Get Started'}</span>
            <span>{'>'}</span>
        </button>
    )
}

export { AddToSlackButton }
