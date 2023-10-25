import { Events } from 'Admin/scenarios/Events'
import { Restaurants } from 'Admin/scenarios/Restaurants'
import { SlackUsers } from 'Admin/scenarios/SlackUsers'
import Image from 'next/image'
import MascotHappy from 'Admin/assets/MascotHappy.svg'
import { EventCalendar } from './Events/components/EventCalendar'
import { useState } from 'react'

const AdminMainPage = () => {
    const [calendarShowing, setCalendarShowing] = useState(false)

    return (
        <div>
            <div className="grid-background flex w-full justify-evenly pt-16">
                <div className="w-1/3 p-4 [&>*]:mb-14">
                    <h1 className="font-queensMedium text-6xl">Pizza Admin</h1>
                    {calendarShowing ? (
                        <div className="flex">
                            <div className="grow" onClick={() => setCalendarShowing(false)}>
                                <Events />
                            </div>
                            <div className="z-10 flex-none">
                                <EventCalendar />
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setCalendarShowing(true)}>
                            <Events />
                        </div>
                    )}
                    <div className={`${calendarShowing ? 'opacity-25' : ''} `}>
                        <SlackUsers />
                    </div>
                </div>
                <div className={`z-0 w-1/3 p-4 [&>*]:mb-14 ${calendarShowing ? 'opacity-25' : ''} `}>
                    <Image
                        className="mt-16"
                        priority
                        src={MascotHappy}
                        width={450}
                        alt="pizza bot mascot with four arms"
                    />
                    <Restaurants />
                </div>
            </div>
        </div>
    )
}

export { AdminMainPage }
