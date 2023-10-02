import { ModalPencil } from 'Admin/components/ModalPencil'
import { ModalProvider } from 'Admin/context/ModelContext'

const CardComponent = ({
    title,
    modalFunction,
    children,
}: {
    title: string
    modalFunction?: React.ReactNode
    children?: React.ReactNode
}) => {
    return (
        <div className={'w-[25rem] bg-[#FFF8C1] p-4 shadow-2xl'}>
            <div className="flex justify-between">
                <h5 className="mb-2 ml-6 pt-3 font-queensRegular text-3xl font-semibold text-[#05793C]">{title}</h5>

                {modalFunction && (
                    <div className="mr-6 pt-4">
                        <ModalProvider>
                            <ModalPencil>{modalFunction}</ModalPencil>
                        </ModalProvider>
                    </div>
                )}
            </div>
            <div className="mx-auto flex w-[86%] justify-center border border-dashed border-[#05793C]" />
            <div className="ml-5 px-6 py-3 text-[#303030]">{children}</div>
        </div>
    )
}

export { CardComponent }
