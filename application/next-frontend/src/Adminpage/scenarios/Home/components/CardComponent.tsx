interface CardComponentProps {
    title: string
    children?: React.ReactNode
    className?: string
}

const CardComponent: React.FC<CardComponentProps> = ({ title, children, className }) => {
    const defaultClassName = 'block border-2 border-black bg-white p-6'
    const finalClassName = className ? `${defaultClassName} ${className}` : defaultClassName

    return (
        <div className={finalClassName}>
            <h5 className="mb-2 text-center font-mono text-2xl font-bold leading-tight text-neutral-800">{title}</h5>
            {children}
        </div>
    )
}

export default CardComponent
