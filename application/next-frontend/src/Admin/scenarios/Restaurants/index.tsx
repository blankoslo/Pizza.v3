import { NewRestaurantModal } from './components/NewRestaurantModal'
import { CardComponentWrapper } from 'Admin/components/CardComponentWrapper'
import { useRestaurants } from '@/api/useRestaurants'
import { useModal } from 'Shared/context/ModalContext'
import { HoverProvider } from '@/Shared/context/HoverContext'

const Restaurants = () => {
    const { data, isLoading, error, delRestaurant } = useRestaurants()
    const { openModal } = useModal()

    const handleOnClickEditIcon = () => {
        openModal(<NewRestaurantModal />)
    }

    return (
        <HoverProvider>
            <CardComponentWrapper title="Places" editIcon onClickEditIcon={handleOnClickEditIcon}>
                <div className="scrollable-wrapper mb-2 pb-8">
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
            </CardComponentWrapper>
        </HoverProvider>
    )
}

export { Restaurants }
