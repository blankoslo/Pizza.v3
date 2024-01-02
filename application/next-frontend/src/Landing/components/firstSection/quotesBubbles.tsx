import MathildeRound from '@/Landing/assets/MathildeRound.svg'
import AmalieRound from '@/Landing/assets/AmalieRound.svg'
import Image from 'next/image'

const QuoteBubbles = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="relative flex flex-col pr-12">
                <Image src={AmalieRound} alt="Citation pic" className="absolute -top-8 right-0 z-10 rounded-full" />
                <span className="rounded-full bg-green-primary p-4 text-xl text-white"> Yes!!</span>
            </div>
            <div className="relative flex flex-col pr-12">
                <Image src={MathildeRound} alt="Citation pic" className="absolute -top-8 right-0 z-10 rounded-full" />
                <span className="rounded-full bg-green-primary p-4 text-xl text-white "> Woooo⭐️ </span>
            </div>
        </div>
    )
}

export { QuoteBubbles }
