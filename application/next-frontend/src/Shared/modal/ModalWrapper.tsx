import { useModal } from 'Shared/context/ModalContext'

interface ModalWrapperProps {
    children: React.ReactNode
}

const ModalWrapper = ({ children }: ModalWrapperProps) => {
    const { closeModal } = useModal()

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }
    return (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleOverlayClick} />
            <div className="z-10">{children}</div>
        </div>
    )
}

export { ModalWrapper }
