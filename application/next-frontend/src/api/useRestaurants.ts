import { apiRequestHelper } from './utils'
import { useAuthedSWR } from './useAuthedSWR'

export interface Restaurant {
    name: string
    link?: string
    tlf?: string
    address?: string
}

export interface ApiRestaurant extends Restaurant {
    id: string
    rating?: string
}

const useRestaurants = () => {
    const endpoint = '/restaurants'
    const { data, isLoading, error, mutate } = useAuthedSWR<ApiRestaurant[]>(endpoint)
    const { post, del } = apiRequestHelper

    const addRestaurant = (newRestaurant: Restaurant) => {
        try {
            mutate(
                async () => {
                    await post<Restaurant>(endpoint, newRestaurant)

                    if (data) {
                        return [...data, newRestaurant]
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

    const delRestaurant = (restaurantId: string) => {
        try {
            mutate(
                async () => {
                    await del<ApiRestaurant>(`${endpoint}/${restaurantId}`)

                    if (data) {
                        return data.filter((restaurant) => restaurant.id !== restaurantId)
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

    return { data, isLoading, error, addRestaurant, delRestaurant }
}

export { useRestaurants }
