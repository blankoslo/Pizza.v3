import Image from 'next/image'
import Tape from 'Landing/assets/illustrations/Tape.svg'
import { useState } from 'react'

type Props = {
    src: string
    text: string
    styles: {
        tape: string
        postit: string
        postitHover: string
        postitHoverAlternative: string
    }
}

const ImageWithPostit = ({ src, text, styles }: Props) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div className="relative flex" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Image src={Tape} alt="tape" className={`absolute z-30 ${styles.tape}`} />
            <Image src={src} alt="fun" className="z-10" />
            <div
                className={`absolute min-h-[350px] w-[320px] p-10 font-workSans text-xl lg:w-[350px] ${styles.postit} ${
                    isHovered ? styles.postitHover : styles.postitHoverAlternative
                }`}
            >
                {text}
            </div>
        </div>
    )
}

export { ImageWithPostit }
