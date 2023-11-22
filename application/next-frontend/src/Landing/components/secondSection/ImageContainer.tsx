import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'

const ImageContainer = ({ img, text }: { img: string | StaticImport; text: string }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="h-36 w-36">
                <Image src={img} alt={text} />
            </div>
            <span className="mt-2">{text}</span>
        </div>
    )
}

export { ImageContainer }
