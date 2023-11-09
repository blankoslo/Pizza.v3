import { Events } from 'Admin/scenarios/Events'
import { Restaurants } from 'Admin/scenarios/Restaurants'
import { SlackChannel } from '@/Admin/scenarios/SlackChannel'
import Image from 'next/image'
import MascotHappy from 'Admin/assets/MascotHappy.svg'
import { EventCalendar } from './Events/components/EventCalendar'
import { useState, useRef, useEffect } from 'react'
import { ModalProvider } from '../context/ModelContext'

const AdminMainPage = () => {
    const [calendarShowing, setCalendarShowing] = useState(false)

    const focusedAreaRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarShowing && focusedAreaRef.current && !focusedAreaRef.current.contains(event.target as Node)) {
                setCalendarShowing(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [calendarShowing])

    return (
        <div>
            <div
                className={`grid-background flex w-full justify-evenly pt-16 ${
                    calendarShowing ? 'pointer-events-none' : ''
                }`}
            >
                <div className="w-1/3 p-4 [&>*]:mb-14">
                    <h1 className="font-queensMedium text-6xl">Pizza Admin</h1>
                    {calendarShowing ? (
                        <div ref={focusedAreaRef} className="pointer-events-auto flex">
                            <div className="grow" onClick={() => setCalendarShowing(false)}>
                                <Events />
                            </div>
                            <div className="z-10 flex-none">
                                <ModalProvider>
                                    <EventCalendar />
                                </ModalProvider>
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setCalendarShowing(true)}>
                            <Events />
                        </div>
                    )}
                    <div className={`${calendarShowing ? 'opacity-25' : ''} `}>
                        <SlackChannel />
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
