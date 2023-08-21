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
        <div className={`block border-2 border-black bg-white p-6 ${className ?? ''}`}>
            <h5 className="mb-2 text-center font-mono text-2xl font-bold leading-tight text-neutral-800">{title}</h5>
            {children}
        </div>
    )
}

export { CardComponent }
