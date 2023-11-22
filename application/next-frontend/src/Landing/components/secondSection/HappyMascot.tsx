import Image from 'next/image'
import HappyMascotSVG from 'Landing/assets/illustrations/HappyMascotLanding.svg'

const HappyMascot = () => {
    return (
        <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-col items-center">
                <div className="ml-[-7rem] h-28 w-72 bg-green-secondary p-4">
                    <span className="text-2xl font-medium text-green-tertiary">
                        Pizza is also just <b>Delicious!!</b>
                    </span>
                </div>
                <div className="relative mt-[-3.6rem] h-60 w-full">
                    <Image src={HappyMascotSVG} alt="Happy Mascot" layout="fill" objectFit="contain" />
                </div>
            </div>
        </div>
    )
}

export { HappyMascot }
