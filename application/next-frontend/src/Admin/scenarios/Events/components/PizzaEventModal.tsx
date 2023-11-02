import { useModal } from '@/Admin/context/ModelContext'

type Props = {
    children: React.ReactNode
}

const PizzaEventModal = (props: Props) => {
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
                    <div className="relative z-10">{props.children}</div>
                </div>
            )}
        </>
    )
}

export { PizzaEventModal }
