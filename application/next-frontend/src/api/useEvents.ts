import { useAuthedSWR } from './useAuthedSWR'
import { ApiRestaurant } from './useRestaurants'
import { apiRequestHelper } from './utils'

export interface Event {
    time: string
}

export interface ApiEvent extends Event {
    id: string
    finalized: boolean
    restaurant?: ApiRestaurant
    people_per_event: number
}

export interface ApiEventPost extends Event {
    restaurant_id: string
    people_per_event: number
    group_id?: string
}

const useEvents = () => {
    const endpoint = '/events'
    const { data, isLoading, error, mutate } = useAuthedSWR<ApiEvent[]>(endpoint)
    const { post, del } = apiRequestHelper

    const addEvent = async (newEvent: ApiEventPost) => {
        try {
            mutate(
                async () => {
                    const createdEvent = await post<ApiEventPost>(endpoint, newEvent)

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

    const delEvent = (eventId: string) => {
        try {
            mutate(
                async () => {
                    await del<ApiEventPost>(`${endpoint}/${eventId}`)

                    if (data) {
                        return data.filter((event) => event.id !== eventId)
                    }
                },
                {
                    populateCache: true,
                    rollbackOnError: true,
                    revalidate: false,
                },
            )
        } catch (e) {
            console.error(e)
        }
    }

    return { data, isLoading, error, addEvent, delEvent }
}

export { useEvents }
