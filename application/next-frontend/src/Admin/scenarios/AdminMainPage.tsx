import { Events } from 'Admin/scenarios/Events'
import { Restaurants } from 'Admin/scenarios/Restaurants'
import { SlackChannel } from '@/Admin/scenarios/SlackChannel'
import Image from 'next/image'
import MascotHappy from 'Admin/assets/MascotHappy.svg'

import { HoverProvider } from 'Shared/context/HoverContext'

const AdminMainPage = () => {
    return (
        <div className="grid-background flex items-center justify-center p-16 px-10 lg:p-20">
            <div className={`flex w-full max-w-[1500px] flex-col items-center gap-16`}>
                <div className="grid w-full grid-cols-1 items-center justify-items-center gap-16 lg:grid-cols-2">
                    <div>
                        <h1 className="w-full text-left font-queensMedium text-6xl">Pizza Admin</h1>
                    </div>
                    <div />
                    <HoverProvider>
                        <Events />
                    </HoverProvider>
                    <Image
                        className="row-start-6 lg:row-start-[unset]"
                        priority
                        src={MascotHappy}
                        width={450}
                        alt="pizza bot mascot with four arms"
                    />
                    <HoverProvider>
                        <SlackChannel />
                    </HoverProvider>

                    <HoverProvider>
                        <Restaurants />
                    </HoverProvider>
                </div>
            </div>
        </div>
    )
}

export { AdminMainPage }
