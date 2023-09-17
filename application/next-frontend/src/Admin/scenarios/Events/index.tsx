import { ModalButton } from 'Admin/components/ModalButton'
import { ModalProvider } from 'Admin/context/ModelContext'
import { CreateEventCard } from './components/CreateEventCard'
import { CardComponent } from 'Admin/components/CardComponent'
import { useEvents } from '@/api/useEvents'
import { format } from 'date-fns'

const Events = () => {
    const { data, isLoading, error } = useEvents()

    return (
        <CardComponent title="Dates" className="w-1/4">
            {isLoading
                ? 'Loading...'
                : error
                ? `Failed to load events due to the following error: ${error?.info.msg}`
                : !data || data.length == 0
                ? 'No events found.'
                : data.map((event, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                          <p>{formatTimeString(event.time)}</p>
                      </div>
                  ))}
            <ModalProvider>
                <ModalButton buttonText="New event">
                    <CreateEventCard />
                </ModalButton>
            </ModalProvider>
        </CardComponent>
    )
}

const formatTimeString = (inputTime: string): string => {
    const dateObj = new Date(inputTime)
    return format(dateObj, "do 'of' MMMM 'at' h:mm a")
}

export { Events }
