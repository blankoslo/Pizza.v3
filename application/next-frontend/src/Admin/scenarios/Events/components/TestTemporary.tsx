import { useModal } from '@/Admin/context/ModelContext'
import { CreatePizzaEventCard } from './CreatePizzaEventCard'

const TestTemporary = () => {
    const { openModal, isModalOpen, closeModal } = useModal()

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    return (
        <div>
            <button onClick={() => openModal()} className="border border-cyan-600 bg-slate-100">
                Create Pizza Event!
            </button>
            {isModalOpen && (
                <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleOverlayClick} />
                    <div className="relative z-10">
                        <CreatePizzaEventCard />
                    </div>
                </div>
            )}
        </div>
    )
}

export { TestTemporary }
