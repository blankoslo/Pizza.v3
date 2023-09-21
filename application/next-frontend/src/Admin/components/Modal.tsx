import { useModal } from 'Admin/context/ModelContext'

const Modal = ({ children }: { children: React.ReactNode }) => {
    const { isModalOpen, closeModal } = useModal()

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    return (
        <>
            {isModalOpen && (
                <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleOverlayClick} />
                    <div className="relative z-10 w-1/2 rounded-md bg-white p-6 shadow-md">{children}</div>
                </div>
            )}
        </>
    )
}

export { Modal }
