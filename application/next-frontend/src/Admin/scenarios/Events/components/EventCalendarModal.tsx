import { HoverProvider } from 'Shared/context/HoverContext'
import { Events } from '@/Admin/scenarios/Events/'
import { EventCalendar } from '@/Admin/scenarios/Events/components/EventCalendar'

const EventModal = () => {
    return (
        <HoverProvider isInsideModal>
            <div className="pointer-events-auto flex flex-col items-center justify-center lg:flex-row">
                <Events clickable={false} />
                <EventCalendar />
            </div>
        </HoverProvider>
    )
}

export { EventModal }
