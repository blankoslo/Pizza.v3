import { EditBotModal } from '@/Admin/components/EditBotModal'
import { ModalProvider } from 'Admin/context/ModelContext'

const CardComponent = ({
    title,
    modalContent,
    children,
}: {
    title: string
    modalContent?: React.ReactNode
    children?: React.ReactNode
}) => {
    return (
        <div className={'min-h-[16rem] w-[25rem] bg-yellow p-4 shadow-2xl'}>
            <div className="flex justify-between">
                <h5 className="mb-2 ml-6 pt-3 font-queensRegular text-3xl font-semibold text-green-primary">{title}</h5>

                {modalContent && (
                    <div className="mr-6 pt-4">
                        <ModalProvider>
                            <EditBotModal>{modalContent}</EditBotModal>
                        </ModalProvider>
                    </div>
                )}
            </div>
            <div className="mx-auto flex w-[86%] justify-center border border-dashed border-green-primary" />
            <div className="ml-5 px-6 py-3 text-dark">{children}</div>
        </div>
    )
}

export { CardComponent }
