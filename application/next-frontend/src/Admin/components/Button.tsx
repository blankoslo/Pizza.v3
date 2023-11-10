type ButtonProps = {
    onClick?: () => void
    className?: string
    text: string
    buttonStyle: 'primary' | 'secondary'
    type?: 'submit' | 'reset' | 'button'
    value?: string
}

const Button = ({ onClick, className, text, buttonStyle, type, value }: ButtonProps) => {
    const primaryStyle = 'bg-white font-black hover:bg-green-secondary border-b-8'
    const secondaryStyle = 'bg-green-light font-semibold hover:bg-yellow'

    return (
        <button
            onClick={onClick}
            className={`border-2 border-green-primary py-4 font-workSans text-2xl text-green-primary focus:outline-none ${
                buttonStyle === 'primary' ? primaryStyle : secondaryStyle
            } ${className}`}
            type={type ?? 'button'}
            value={value}
        >
            {text}
        </button>
    )
}

export default Button
