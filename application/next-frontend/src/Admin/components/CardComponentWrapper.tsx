import React from 'react'
import Image from 'next/image'
import Pencil from 'Admin/assets/Pencil.svg'
import { useHover } from '@/Shared/context/HoverContext'

const CardComponentWrapper = ({
    title,
    children,
    editIcon,
    onClickEditIcon,
}: {
    title: string
    children?: React.ReactNode
    editIcon?: boolean
    onClickEditIcon?: () => void
}) => {
    const { setHovered } = useHover()
    return (
        <div
            className="relative min-h-[16rem] w-[25rem] bg-yellow p-4 hover:shadow-custom"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="flex justify-between">
                <h5 className="mb-2 ml-6 pt-3 font-queensRegular text-3xl font-semibold text-green-primary">{title}</h5>

                {editIcon && (
                    <Image
                        onClick={onClickEditIcon}
                        className="cursor-pointer"
                        priority
                        src={Pencil}
                        width={20}
                        alt="edit this card"
                    />
                )}
            </div>
            <div className="mx-auto flex w-[86%] justify-center border border-dashed border-green-primary" />
            <div className="ml-5 px-6 py-3 text-dark">{children}</div>
        </div>
    )
}

export { CardComponentWrapper }
