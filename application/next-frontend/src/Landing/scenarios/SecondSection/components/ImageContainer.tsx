import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'

const ImageContainer = ({ img, text }: { img: string | StaticImport; text: string }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative size-28">
                <Image
                    src={img}
                    alt={text}
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: 'cover',
                    }}
                />
            </div>
            <span className="mt-2 text-[18px] lg:text-[34px]">{text}</span>
        </div>
    )
}

export { ImageContainer }
