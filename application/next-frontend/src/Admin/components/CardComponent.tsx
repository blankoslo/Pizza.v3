const CardComponent = ({
    title,
    children,
    className,
}: {
    title: string
    children?: React.ReactNode
    className?: string
}) => {
    return (
        <div className={`w-[25rem] bg-[#FFF8C1] p-4 ${className ?? ''}`}>
            <h5 className="mb-2 px-6 py-3 font-workSans text-2xl font-semibold leading-tight text-neutral-800">
                {title}
            </h5>
            <div className="px-6 py-3">{children}</div>
        </div>
    )
}

export { CardComponent }
