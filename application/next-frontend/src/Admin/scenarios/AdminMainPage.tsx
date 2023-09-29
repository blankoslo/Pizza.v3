// import { Events } from "Admin/scenarios/Events/index"
// import { Restaurants } from "Admin/scenarios/Restaurants/index"
// import { SlackUsers } from "Admin/scenarios/SlackUsers"
import Image from 'next/image'
import MascotWithFourArms from 'Admin/assets/MascotWithFourArms.svg'
import { Events } from './Events'
import { SlackUsers } from './SlackUsers'
import { Restaurants } from './Restaurants'

const AdminMainPage = () => {
    return (
        <div className="grid-background flex w-full justify-evenly">
            <div className="flex w-1/3 flex-col justify-evenly border p-4">
                <h1 className="font-queensCTM text-6xl">Pizza Admin</h1>
                <Events />
                <SlackUsers />
            </div>
            <div className="flex w-1/3 flex-col justify-evenly p-4">
                <Image priority src={MascotWithFourArms} width={450} alt="pizza bot mascot with four arms" />
                <Restaurants />
            </div>
        </div>
    )
}

export { AdminMainPage }
