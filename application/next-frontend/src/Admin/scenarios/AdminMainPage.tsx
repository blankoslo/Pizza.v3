import { Events } from 'Admin/scenarios/Events'
import { Restaurants } from 'Admin/scenarios/Restaurants'
import { SlackChannel } from 'Admin/scenarios/SlackChannel'
import Image from 'next/image'
import MascotHappy from 'Admin/assets/MascotHappy.svg'
import { EventCalendar } from 'Admin/scenarios/Events/components/EventCalendar'
import { useState, useEffect } from 'react'
import { HoverProvider } from 'Shared/context/HoverContext'
import { useModal } from 'Shared/context/ModalContext'

const AdminMainPage = () => {
    const { openModal, modalStack } = useModal()
    const [eventModalShowing, setEventModalShowing] = useState<boolean>(false)

    useEffect(() => {
        if (modalStack.length == 0) {
            setEventModalShowing(false)
        }
    }, [modalStack])

    const handleOnEventClick = () => {
        setEventModalShowing(true)
        openModal(<EventModal />)
    }

    const EventModal = () => {
        return (
            <div className="pointer-events-auto flex">
                <div className="grow">
                    <Events />
                </div>
                <div className="z-10 flex-none">
                    <EventCalendar />
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className={`grid-background flex w-full justify-evenly pt-16 `}>
                <div className="w-1/3 p-4 [&>*]:mb-14">
                    <h1 className="font-queensMedium text-6xl">Pizza Admin</h1>
                    <div onClick={handleOnEventClick} className={`${eventModalShowing ? 'opacity-0' : ''}`}>
                        <Events />
                    </div>
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
