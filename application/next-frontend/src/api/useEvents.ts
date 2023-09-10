import { useAuthedSWR } from './useAuthedSWR'
import { apiRequestHelper } from './utils'

export interface Event {
    id: string
    date: string
    restaurantId: string
    peoplePerEvent: number
}

const useEvents = () => {
    const endpoint = '/events'
    const { data, mutate } = useAuthedSWR<Event[]>(endpoint)
    const { post } = apiRequestHelper

    const addEvent = async (newEvent: Event) => {
        try {
            const createdEvent = await post<Event>(endpoint, newEvent)

            if (data) {
                mutate([...data, createdEvent], { rollbackOnError: true, revalidate: false }) // local data contains the newly created event.
            }
        } catch (e) {
            console.error(e)
        }
    }

    return { data, addEvent }
}

export default useEvents
