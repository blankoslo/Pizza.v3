import { NewRestaurantModal } from './components/NewRestaurantModal'
import { CardComponent } from 'Admin/components/CardComponent'
import { useRestaurants } from '@/api/useRestaurants'

const Restaurants = () => {
    const { data, isLoading, error, delRestaurant } = useRestaurants()

    return (
        <CardComponent title="Places" modalFunction={<NewRestaurantModal />}>
            <div className="scrollable-wrapper mb-2">
                <div className="scrollable-list">
                    {isLoading
                        ? 'Loading...'
                        : error
                        ? `Failed to load users due to the following error: ${error?.info.msg}`
                        : !data || data.length == 0
                        ? 'No restaurants found.'
                        : data.map((restaurant) => (
                              <div key={restaurant.id} className="flex py-2 text-2xl">
                                  <button onClick={() => delRestaurant(restaurant.id)}>&times;</button>
                                  <p className="ml-2 font-workSans italic">{restaurant.name}</p>
                              </div>
                          ))}
                </div>
            </div>
        </CardComponent>
    )
}

export { Restaurants }
