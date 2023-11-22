import { HoverProvider } from 'Shared/context/HoverContext'
import { Events } from '@/Admin/scenarios/Events/'
import { EventCalendar } from '@/Admin/scenarios/Events/components/EventCalendar'

const EventModal = () => {
    return (
        <div className="pointer-events-auto flex">
            <div className="flex">
                <HoverProvider isInsideModal>
                    <Events clickable={false} />
                </HoverProvider>
                <EventCalendar />
            </div>
        </div>
    )
}

export { EventModal }
