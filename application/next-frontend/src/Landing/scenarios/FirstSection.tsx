import Image from 'next/image'
import Line from 'Landing/assets/Line.svg'

import { AddToSlackButton } from '@/Landing/components/AddToSlackButton'
import { clientsideApiUri } from '@/api/endpoints'

const addToSlack = async () => {
    const res = await fetch(clientsideApiUri + '/slack/install', { method: 'GET' }).then((res) => res.json())
    const redirectURL = res.redirect_url

    if (redirectURL) window.location.assign(redirectURL)
}

const FirstSection = () => {
    return (
        <div className="flex min-h-[50rem] flex-col items-center bg-green-light">
            <span className="mt-12 text-center font-queensMedium text-9xl text-green-primary">
                A slice to <i>socialise</i>
            </span>
            <Image height={5.5} src={Line} alt="dotted line" />
            <span className="mb-5 mt-16 w-1/3 text-center text-3xl font-medium leading-9 text-green-tertiary">
                Download the PizzaBot to build better work environments.
            </span>
            <AddToSlackButton onClick={addToSlack} />
        </div>
    )
}

export { FirstSection }
