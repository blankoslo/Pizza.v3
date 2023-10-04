import { CreateEventCard } from './components/CreateEventCard'
import { CardComponent } from 'Admin/components/CardComponent'
import { useEvents } from '@/api/useEvents'
import { format } from 'date-fns'
import { ApiEvent } from '@/api/useEvents'

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
    const [time, meridiem] = futureEvents.length > 0 ? eventTimeFormatted(futureEvents[0].time) : [0, 0]

    return (
        <CardComponent title="Events" modalComponent={<CreateEventCard />}>
            {isLoading ? (
                'Loading...'
            ) : error ? (
                `Failed to load events. ${error?.info.msg}`
            ) : !data || !data.length || !futureEvents.length ? (
                ''
            ) : (
                <div className="mt-5 flex flex-col">
                    <div className="italic text-[#05793C]">Next event:</div>
                    <h3 className="text-2xl font-semibold leading-10">{futureEvents[0].restaurant?.name}</h3>
                    <h4 className="text-xl font-semibold leading-10">{eventDateFormatted(futureEvents[0].time)}</h4>
                    <span className="text-xl font-semibold leading-7">
                        {time} <span className="italic">{meridiem}</span>
                    </span>
                </div>
            )}
            <div className="my-10 italic text-[#05793C]">{upcomingEventsMessage(futureEvents.length)}</div>
        </CardComponent>
    )
}

export { Events }
