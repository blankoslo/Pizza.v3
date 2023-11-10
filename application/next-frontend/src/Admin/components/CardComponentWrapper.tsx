import React from 'react'
import { useHover } from '@/Shared/context/HoverContext'

const CardComponentWrapper = ({
    title,
    children,
    editIcon,
    onClickCard,
}: {
    title: string
    children?: React.ReactNode
    editIcon?: boolean
    onClickCard?: () => void
}) => {
    const { setHovered, isHovered } = useHover()
    return (
        <div
            className={`relative min-h-[16rem] w-[25rem] bg-yellow p-4 hover:shadow-custom ${editIcon ? 'hover:cursor-pointer' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClickCard}
        >
            <div className="flex justify-between">
                <h5 className="mb-2 ml-6 pt-3 font-queensRegular text-3xl font-semibold text-green-primary">{title}</h5>

                
            </div>
            <div className="mx-auto flex w-[86%] justify-center border border-dashed border-green-primary" />
            <div className="ml-5 px-6 py-3 text-dark">{children}</div>
            {editIcon && isHovered && (
                    <div className="absolute right-5 bottom-5">
                    <span
                        className="marked-entry-card flex cursor-pointer items-center px-3 font-workSans italic text-green-primary"
                        
                    >
                        Add <span className='text-2xl font-semibold pl-3'>+</span>
                    </span>
                </div>
                )}
        </div>
    )
}

export { CardComponentWrapper }
