import { NewRestaurantModal } from './components/NewRestaurantModal'
import { CardComponentWrapper } from 'Admin/components/CardComponentWrapper'
import { useRestaurants } from '@/api/useRestaurants'
import { useModal } from 'Shared/context/ModalContext'
import { useHover } from 'Shared/context/HoverContext'


const Restaurants = () => {
    const { data, isLoading, error, delRestaurant } = useRestaurants()
    const { openModal } = useModal()
    const { isHovered } = useHover()

    const handleOnClickEditIcon = () => {
        openModal(<NewRestaurantModal />)
    }

    return (
            <CardComponentWrapper title="Places" editIcon onClickEditIcon={handleOnClickEditIcon}>
                <div className="scrollable-wrapper mb-2 pb-8">
                    <div className="scrollable-list">
                        {isLoading
                            ? 'Loading...'
                            : error
                            ? `Failed to load users due to the following error: ${error?.info.msg}`
                            : !data || data.length == 0
                            ? 'No restaurants found. Try adding one!'
                            : (
                                <div className="mt-5 flex flex-col pb-16">
                                    <div className="pl-4 italic text-green-primary">You have added...</div>
                                    <h3 className="text-2xl font-semibold leading-10">
                                        <span className={`px-4 ${isHovered ? 'marked-entry-card' : ''}`}>
                                            {data.length} {data.length == 1 ? 'Pizza Place' : 'Pizza Places'}
                                        </span>
                                    </h3>
                                </div>
                            )}
                    </div>
                </div>
            </CardComponentWrapper>
    )
}

export { Restaurants }
