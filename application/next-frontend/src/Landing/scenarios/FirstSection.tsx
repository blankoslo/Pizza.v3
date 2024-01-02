import Image from 'next/image'
import { AddToSlackButtonWhiteRounded } from '@/Landing/components/AddToSlackButtons'
import Mascot from '@/Landing/assets/illustrations/MascotWithFourArmsGreen.svg'
import SpeachBubble from '@/Landing/assets/illustrations/SpeachBubble.svg'
import { MadeByBlank } from '../components/firstSection/madeByBlank'
import { QuoteBubbles } from '../components/firstSection/quotesBubbles'

const RightSideMascot = () => {
    return (
        <div className="flex w-full min-w-[360px] flex-col items-center justify-center">
            <div className="relative min-w-[24rem] max-w-[32rem]">
                <Image src={SpeachBubble} className="w-full" alt="Speachbubble" />
                <div className="absolute top-[10%] z-10 flex flex-col justify-center px-8 font-workSans text-green-light">
                    <span className="text-2xl">Buongiorno!</span>
                    <span className="text-xl">You 5 have been selected to go out to eat 🍕pizza!🍕</span>
                </div>
            </div>
            <div className="relative flex min-w-[16rem] max-w-[32rem] justify-center">
                <Image src={Mascot} alt="Mascot" className="animate-bobber px-8" />
                <div className="absolute bottom-0 right-0">
                    <QuoteBubbles />
                </div>
            </div>
        </div>
    )
}

const FirstSection = () => {
    return (
        <section className="flex min-h-[50rem] flex-col items-center justify-center gap-14 bg-green-tertiary">
            <div className="flex flex-row flex-wrap gap-16 lg:flex-nowrap lg:gap-8">
                <div className="flex flex-col items-center gap-8 p-16">
                    <span className="text-center font-queensMedium text-7xl text-green-secondary lg:text-9xl">
                        A slice to <i>socialise</i>
                    </span>
                    <span className="text-center font-workSans text-2xl text-green-light lg:text-3xl">
                        <span>The PizzaBot invites 5 random people from your slack team out to eat Pizza. </span>
                        <span className="font-bold">Building friendships over shared love for great food {':)'}</span>
                    </span>
                    <AddToSlackButtonWhiteRounded />
                </div>
                <div className="flex w-full flex-col items-center justify-center overflow-hidden px-8">
                    <RightSideMascot />
                </div>
            </div>
            <MadeByBlank />
        </section>
    )
}

export { FirstSection }
