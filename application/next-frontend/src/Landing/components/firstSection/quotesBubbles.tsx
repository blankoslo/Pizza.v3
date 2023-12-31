import MathildeRound from '@/Landing/assets/MathildeRound.svg'
import AmalieRound from '@/Landing/assets/AmalieRound.svg'
import Image from 'next/image'

const QuoteBubbles = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="relative flex flex-col">
                <Image src={AmalieRound} alt="Citation pic" className="z-10 mb-[-10%] ml-20 rounded-full" />
                <span className="rounded-full bg-green-primary p-4 text-xl text-white"> Yes!!</span>
            </div>
            <div className="relative flex flex-col">
                <Image src={MathildeRound} alt="Citation pic" className="z-10 mb-[-10%] ml-20 rounded-full" />
                <span className="rounded-full bg-green-primary p-4 text-xl text-white "> Woooo⭐️ </span>
            </div>
        </div>
    )
}

export { QuoteBubbles }
