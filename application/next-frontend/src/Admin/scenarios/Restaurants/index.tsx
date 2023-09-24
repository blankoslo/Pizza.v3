import { NewRestaurantModal } from './components/NewRestaurantModal'
import { CardComponent } from 'Admin/components/CardComponent'
import { ModalButton } from 'Admin/components/ModalButton'
import { ModalProvider } from 'Admin/context/ModelContext'
import { useRestaurants } from '@/api/useRestaurants'

const Restaurants = () => {
    const { data, isLoading, error, delRestaurant } = useRestaurants()

    return (
        <CardComponent title="What pizza places would you like to visit?">
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

            <ModalProvider>
                <ModalButton buttonText="Add">
                    <NewRestaurantModal />
                </ModalButton>
            </ModalProvider>
        </CardComponent>
    )
}

export { Restaurants }
