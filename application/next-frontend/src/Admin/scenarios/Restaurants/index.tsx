import NewRestaurantModal from './components/NewRestaurantModal'
import CardComponent from 'Admin/components/CardComponent'
import ModalButton from 'Admin/components/ModalButton'
import { ModalProvider } from 'Admin/context/ModelContext'

interface Restaurant {
    name: string
    address?: string
    url?: string
}

// Sample restaurant data
const restaurantList: Restaurant[] = [
    {
        name: 'Example Restaurant 1',
    },
    {
        name: 'Example Restaurant 2',
    },
]

const Restaurants = () => {
    return (
        <CardComponent title="Places" className=" w-1/4">
            {restaurantList.map((restaurant: Restaurant, index: number) => (
                <div key={index} className="flex items-center justify-between py-2">
                    <p>{restaurant.name}</p>
                    <button>&times;</button>
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

export default Restaurants
