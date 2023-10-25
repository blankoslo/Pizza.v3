import { useModal } from '@/Admin/context/ModelContext'
import Image from 'next/image'

type Props = {
    styling: string
    children: React.ReactNode
    eventId: string | number
    day: number
    image: string
}

const PizzaEventModal = (props: Props) => {
    const { openModal, isModalOpen, closeModal } = useModal()

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    return (
        <>
            <td className={`${props.styling} text-center`} onClick={() => openModal()}>
                {props.day}
                {props.eventId !== -1 && <Image className="mx-auto" src={props.image} width={43} alt="pizza" />}
            </td>

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
