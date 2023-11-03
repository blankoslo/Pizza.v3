import { CreatePizzaEventCard } from 'Admin/scenarios/Events/components/CreatePizzaEventCard'
import { CardComponent } from 'Admin/components/CardComponent'
import { useEvents } from '@/api/useEvents'
import { ApiEvent } from '@/api/useEvents'
import { format } from 'date-fns'
import { NextEventInfo } from './components/NextEventInfo'

const futureDate = (date: ApiEvent) => new Date(date.time) >= new Date()

const differenceBetweenTwoDates = (date1: ApiEvent, date2: ApiEvent) =>
    new Date(date1.time).getTime() - new Date(date2.time).getTime()

const eventDateFormatted = (date: string) => format(new Date(date), 'EEEE, dd. MMMM')

const eventTimeFormatted = (date: string) =>
    format(new Date(date), 'h:mm a').toLowerCase().replace('am', 'a.m.').replace('pm', 'p.m.').split(' ')

const upcomingEventsMessage = (eventsNumber: number) =>
    eventsNumber === 1 ? 'You have 1 upcoming event.' : `You have ${eventsNumber} upcoming events.`

const Events = () => {
    const { data, isLoading, error } = useEvents()
    const futureEvents = data?.filter(futureDate).sort(differenceBetweenTwoDates) ?? []
    const [time, meridiem] = futureEvents.length > 0 ? eventTimeFormatted(futureEvents[0].time) : ['0', '0']

    return (
        <CardComponent title="Events" modalContent={<CreatePizzaEventCard selectedDate={new Date()} />}>
            {isLoading ? (
                'Loading...'
            ) : error ? (
                `Failed to load events. ${error?.info.msg}`
            ) : !data || !data.length || !futureEvents.length ? (
                ''
            ) : (
                <NextEventInfo
                    event_id={futureEvents[0].id}
                    resturantName={futureEvents[0].restaurant?.name ?? 'Cannot find resturant name'}
                    date={eventDateFormatted(futureEvents[0].time)}
                    time={time}
                    meridiem={meridiem}
                />
            )}
            <div className="mb-10 mt-[11.7rem] italic text-green-primary">
                {upcomingEventsMessage(futureEvents.length)}
            </div>
        </CardComponent>
    )
}

export { Events }
