import { HoverProvider } from 'Shared/context/HoverContext'
import { Events } from '@/Admin/scenarios/Events/'
import { EventCalendar } from '@/Admin/scenarios/Events/components/EventCalendar'

const EventModal = () => {
    return (
        <div className="pointer-events-auto flex">
            <div className="grow">
                <HoverProvider isInsideModal>
                    <Events />
                </HoverProvider>
            </div>
            <div className="z-10 flex-none">
                <EventCalendar />
            </div>
        </div>
    )
}

export { EventModal }
