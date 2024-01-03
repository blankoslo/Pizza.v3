import { NewRestaurantModal } from './components/NewRestaurantModal'
import { CardComponentWrapper } from 'Admin/components/CardComponentWrapper'
import { useRestaurants } from '@/api/useRestaurants'
import { useModal } from 'Shared/context/ModalContext'
import { useHover } from 'Shared/context/HoverContext'

const Restaurants = () => {
    const { data, isLoading, error } = useRestaurants()
    const { openModal } = useModal()
    const { isHovered } = useHover()

    const handleOnClickCard = () => {
        openModal(<NewRestaurantModal />)
    }

    return (
        <CardComponentWrapper title="Places" addIcon onClickCard={handleOnClickCard}>
            <div className="mb-2">
                {isLoading ? (
                    'Loading...'
                ) : error ? (
                    `Failed to load users due to the following error: ${error?.info.msg}`
                ) : (
                    <div className="mt-5 flex flex-col">
                        <div className="pl-4 italic text-green-primary">
                            {!data || data.length == 0 ? 'No restaurants found...' : 'You have added...'}
                        </div>
                        <h3 className="text-2xl font-semibold leading-10">
                            <span className={`px-4 ${isHovered ? 'marked-entry-card' : ''}`}>
                                {!data || data.length == 0
                                    ? 'Try adding one!'
                                    : `${data.length} ${data.length == 1 ? 'Pizza Place' : 'Pizza Places'}`}
                            </span>
                        </h3>
                    </div>
                )}
            </div>
        </CardComponentWrapper>
    )
}

export { Restaurants }
