import Image from 'next/image'
import HandWithTopping from 'Landing/assets/illustrations/HandWithTopping.svg'
import PizzaBotYellow from 'Landing/assets/illustrations/PizzaBotYellow.svg'

import { AddToSlackButtonWhite } from '@/Landing/components/AddToSlackButtonWhite'
import { clientsideApiUri } from '@/api/endpoints'

const addToSlack = async () => {
    const res = await fetch(clientsideApiUri + '/slack/install', { method: 'GET' }).then((res) => res.json())
    const redirectURL = res.redirect_url

    if (redirectURL) window.location.assign(redirectURL)
}

const SixthSection = () => {
    return (
        <div className="flex bg-green-primary">
            <div className="flex w-[60%] flex-col">
                <span className="mb-6 ml-64 mt-10 font-queensRegular text-8xl italic text-green-light">
                    Add the PizzaBot to slack <i>now</i>
                </span>
                <div className="mb-3 ml-64">
                    <AddToSlackButtonWhite onClick={addToSlack} />
                </div>
                <div className="ml-[400px]">
                    <Image src={HandWithTopping} alt="hand with topping" />
                </div>
            </div>
            <div className="flex justify-end">
                <div className="mb-10 mt-auto">
                    <Image src={PizzaBotYellow} alt="yellow pizza bot" />
                </div>
            </div>
        </div>
    )
}

export { SixthSection }
