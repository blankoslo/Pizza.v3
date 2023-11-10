import { Events } from 'Admin/scenarios/Events'
import { Restaurants } from 'Admin/scenarios/Restaurants'
import { SlackChannel } from 'Admin/scenarios/SlackChannel'
import Image from 'next/image'
import MascotHappy from 'Admin/assets/MascotHappy.svg'

import { HoverProvider } from 'Shared/context/HoverContext'

const AdminMainPage = () => {
    return (
        <div>
            <div className={`grid-background flex w-full justify-evenly pt-16 `}>
                <div className="w-1/3 p-4 [&>*]:mb-14">
                    <h1 className="font-queensMedium text-6xl">Pizza Admin</h1>
                    <HoverProvider>
                        <Events />
                    </HoverProvider>
                    <HoverProvider>
                        <SlackChannel />
                    </HoverProvider>
                </div>
                <div className={`z-0 w-1/3 p-4 [&>*]:mb-14`}>
                    <Image
                        className="mt-16"
                        priority
                        src={MascotHappy}
                        width={450}
                        alt="pizza bot mascot with four arms"
                    />
                    <HoverProvider>
                        <Restaurants />
                    </HoverProvider>
                </div>
            </div>
        </div>
    )
}

export { AdminMainPage }
