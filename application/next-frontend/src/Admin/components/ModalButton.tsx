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
                className="float-right my-4 min-w-[7rem] border-2 border-b-8 border-[#2D8F5C] bg-white px-4 py-2 font-workSans text-sm font-black italic text-[#2D8F5C] hover:bg-[#5FE09D] hover:text-white focus:outline-none"
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

export { ModalButton }
