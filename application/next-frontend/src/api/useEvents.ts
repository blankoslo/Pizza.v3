import { useAuthedSWR } from './useAuthedSWR'
import { apiRequestHelper } from './utils'

export interface Event {
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
            mutate(
                async () => {
                    const createdEvent = await post<Event>(endpoint, newEvent)

                    if (data) {
                        return [...data, createdEvent]
                    }
                },
                {
                    rollbackOnError: true,
                    revalidate: false,
                },
            )
        } catch (e) {
            console.error(e)
        }
    }

    return { data, addEvent }
}

export { useEvents }
