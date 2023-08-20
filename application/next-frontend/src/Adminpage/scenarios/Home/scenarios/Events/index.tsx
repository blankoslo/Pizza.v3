import ModalButton from '../../components/ModalButton'
import { ModalProvider } from '../../context/ModelContext'
import CreateEventCard from './scenarios/CreateEventCard'
import CardComponent from '../../components/CardComponent'

const Events = () => {
    return (
        <CardComponent title="Dates" className="w-1/4">
            <div className="flex items-center justify-center border-2 border-black bg-gray-300 py-2 text-center font-bold uppercase">
                [Occurance placeholder]
            </div>
            <ModalProvider>
                <ModalButton buttonText="New event">
                    <CreateEventCard />
                </ModalButton>
            </ModalProvider>
        </CardComponent>
    )
}

export default Events
