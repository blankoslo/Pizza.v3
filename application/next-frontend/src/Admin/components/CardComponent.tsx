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
        <div className={`min-w-[24rem] border-2 border-black bg-white ${className ?? ''}`}>
            <h5 className="mb-2 px-6 py-3 text-center font-mono text-2xl font-bold leading-tight text-neutral-800">
                {title}
            </h5>
            <div className="max-h-[38rem] overflow-y-auto px-6 py-3">{children}</div>
        </div>
    )
}

export { CardComponent }
