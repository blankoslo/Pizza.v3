type Props = {
    text: string
    className: string
}

const Postit = ({ text, className }: Props) => {
    return (
        <div className={`absolute h-[375px] w-[350px] p-10 font-workSans text-xl hover:z-20 ${className}`}>{text}</div>
    )
}

export { Postit }
