import Image from 'next/image'
import Pencil from 'Admin/assets/Pencil.svg'
import { useModal } from 'Admin/context/ModelContext'

type Props = {
    children: React.ReactNode
}

const ModalPencil = ({ children }: Props) => {
    const { isModalOpen, openModal, closeModal } = useModal()

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    return (
        <>
            <Image
                onClick={() => openModal()}
                className="cursor-pointer"
                priority
                src={Pencil}
                width={20}
                alt="edit this card"
            />
            {isModalOpen && (
                <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleOverlayClick} />
                    <div className="z-10">{children}</div>
                </div>
            )}
        </>
    )
}

export { ModalPencil }
