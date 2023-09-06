import { useAuthedSWR, useMutater } from './utils'

export interface Restaurant {
    name: string
    link?: string
    address?: string
    tlf?: string
    id: string
}

const useRestaurants = () => {
    const endpoint = '/restaurants'
    const { data, isLoading, error, mutate } = useAuthedSWR<Restaurant[]>(endpoint)
    const { post } = useMutater()

    const updateRestaurants = (newRestaurant: Restaurant) => {
        console.log('new res ->', newRestaurant)

        try {
            mutate(
                async () => {
                    const restaurant = await post(`${endpoint}/${newRestaurant.name}`, newRestaurant)
                    if (data) {
                        return [...data, restaurant]
                    }
                },
                {
                    rollbackOnError: true,
                    throwOnError: true,
                },
            )
        } catch (e) {
            console.error(e)
        }
    }

    return { data, isLoading, error, updateRestaurants }
}

export default useRestaurants
