import { Events } from 'Admin/scenarios/Events'
import { Restaurants } from 'Admin/scenarios/Restaurants'
import { SlackUsers } from 'Admin/scenarios/SlackUsers'
import Image from 'next/image'
import MascotHappy from 'Admin/assets/MascotHappy.svg'

const AdminMainPage = () => {
    return (
        <div className="grid-background flex w-full justify-evenly pt-16">
            <div className="w-1/3 p-4 [&>*]:mb-14">
                <h1 className="font-queensMedium text-6xl">Pizza Admin</h1>
                <Events />
                <SlackUsers />
            </div>
            <div className="w-1/3 p-4 [&>*]:mb-14">
                <Image className="mt-16" priority src={MascotHappy} width={450} alt="pizza bot mascot with four arms" />
                <Restaurants />
            </div>
        </div>
    )
}

export { AdminMainPage }
