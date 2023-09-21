import { useModal } from 'Admin/context/ModelContext'

const ModalButton = ({ buttonText }: { buttonText: string }) => {
    const { openModal } = useModal()

    return (
        <button
            onClick={() => openModal()}
            className="border-2 border-black px-4 py-2 font-bold hover:bg-gray-300 focus:outline-none"
        >
            {buttonText}
        </button>
    )
}

export { ModalButton }
