import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'

const ImageContainer = ({ img, text }: { img: string | StaticImport; text: string }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative h-20 w-20 lg:h-28 lg:w-28">
                <Image src={img} alt={text} layout="fill" objectFit="cover" />
            </div>
            <span className="mt-2 text-[18px] lg:text-[34px]">{text}</span>
        </div>
    )
}

export { ImageContainer }
