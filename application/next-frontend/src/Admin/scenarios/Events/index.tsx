import { ModalButton } from 'Admin/components/ModalButton'
import { ModalProvider } from 'Admin/context/ModelContext'
import { CreateEventCard } from './components/CreateEventCard'
import { CardComponent } from 'Admin/components/CardComponent'

const Events = () => {
    return (
        <CardComponent title="Dates">
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

export { Events }
