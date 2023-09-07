import { Restaurant } from './useRestaurants'
import { useAuthedSWR } from './utils'
// import { apiRequestHelper } from './utils' -> in another branch rn

export interface Event {
    id: string
    date: Date
    finalized: boolean
    restaurant?: Restaurant
    peoplePerEvent: number
}

const useEvents = () => {
    const endpoint = '/events'
    const { data, mutate } = useAuthedSWR<Event[]>(endpoint)
    //const { post } = apiRequestHelper()

    const addEvent = async (newEvent: Event) => {
        const eventsData = data || []

        try {
            await mutate([...eventsData, newEvent], {
                optimisticData: [...eventsData, newEvent],
                rollbackOnError: true,
                // Make the API request to add the new event here (You need to implement this)
            })
        } catch (e) {
            console.error(e)
        }
    }

    return { data, addEvent }
}

export default useEvents
