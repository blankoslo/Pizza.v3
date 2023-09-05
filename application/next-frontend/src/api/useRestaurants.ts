import { useAuthedSWR } from './utils'

export interface Restaurant {
    name: string
    address?: string
    url?: string
    id: string
}

const useRestaurants = () => {
    return useAuthedSWR<Restaurant[]>('/restaurants')
}

export default useRestaurants
