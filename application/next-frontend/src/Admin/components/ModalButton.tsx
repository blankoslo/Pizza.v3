import { useModal } from 'Admin/context/ModelContext'

const ModalButton = ({ buttonText, children }: { buttonText: string; children: React.ReactNode }) => {
    const { isModalOpen, openModal, closeModal } = useModal()

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    return (
        <>
            <button
                onClick={() => openModal()}
                className="border-2 border-black px-4 py-2 font-bold hover:bg-gray-300 focus:outline-none"
            >
                {buttonText}
            </button>
            {isModalOpen && (
                <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleOverlayClick} />
                    <div className="relative z-10 w-1/2 rounded-md bg-white p-6 shadow-md">{children}</div>
                </div>
            )}
        </>
    )
}

export default ModalButton
