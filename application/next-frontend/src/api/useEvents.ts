import { Restaurant } from './useRestaurants'
import { useAuthedSWR } from './utils'

export interface Event {
    id: string
    date: Date
    finalized: boolean
    restaurant?: Restaurant
    peoplePerEvent: number
}

const useEvents = () => {
    return useAuthedSWR<Event[]>('/events')
}

export default useEvents
