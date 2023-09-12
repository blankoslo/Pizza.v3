import { NewRestaurantModal } from './components/NewRestaurantModal'
import { CardComponent } from 'Admin/components/CardComponent'
import { ModalButton } from 'Admin/components/ModalButton'
import { ModalProvider } from 'Admin/context/ModelContext'
import { useRestaurants } from '@/api/useRestaurants'

const Restaurants = () => {
    const { data, isLoading, error, delRestaurant } = useRestaurants()

    return (
        <CardComponent title="Places" className=" w-1/4">
            {isLoading
                ? 'Loading...'
                : error
                ? `Failed to load users due to the following error: ${error?.info.msg}`
                : !data || data.length == 0
                ? 'No restaurants found.'
                : data.map((restaurant) => (
                      <div key={restaurant.id} className="flex items-center justify-between py-2">
                          <p>{restaurant.name}</p>
                          <button onClick={() => delRestaurant(restaurant.id)}>&times;</button>
                      </div>
                  ))}

            <ModalProvider>
                <ModalButton buttonText="Add More">
                    <NewRestaurantModal />
                </ModalButton>
            </ModalProvider>
        </CardComponent>
    )
}

export { Restaurants }
