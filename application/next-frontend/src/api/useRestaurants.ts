import { apiRequestHelper } from './utils'
import { useAuthedSWR } from './useAuthedSWR'

export interface Restaurant {
    name: string
    link?: string
    tlf?: string
    address?: string
}

const useRestaurants = () => {
    const endpoint = '/restaurants'
    const { data, isLoading, error, mutate } = useAuthedSWR<Restaurant[]>(endpoint)
    const { post } = apiRequestHelper

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

    return { data, isLoading, error, addRestaurant }
}

export { useRestaurants }
