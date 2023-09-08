import { Restaurant } from './useRestaurants'
import { useAuthedSWR } from './utils'
// import { apiRequestHelper } from './utils' -> in another branch rn

export interface Event {
    id: string
    date: string
    finalized: boolean
    restaurant?: Restaurant
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
                mutate([...data, createdEvent], { rollbackOnError: true, revalidate: false }) // revalidate flag to false?
            }
        } catch (e) {
            console.error(e)
        }
    }

    return { data, addEvent }
}

export default useEvents
