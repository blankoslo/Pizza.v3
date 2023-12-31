import Image from 'next/image'
import { AddToSlackButtonWhiteRounded } from '@/Landing/components/AddToSlackButtons'
import Mascot from '@/Landing/assets/illustrations/MascotWithFourArmsGreen.svg'
import SpeachBubble from '@/Landing/assets/illustrations/SpeachBubble.svg'
import { MadeByBlank } from '../components/firstSection/madeByBlank'
import { QuoteBubbles } from '../components/firstSection/quotesBubbles'

const FirstSection = () => {
    return (
        <section className="flex h-[85vh] min-h-[50rem] flex-col items-center justify-center gap-14 bg-green-tertiary">
            <div className="flex flex-row ">
                <div className="flex flex-col items-center justify-center gap-8">
                    <span className="mt-4 w-1/2 text-center font-queensMedium text-9xl text-green-primary">
                        A slice to <i>socialise</i>
                    </span>
                    <span className="w-2/3 text-center font-workSans text-3xl text-green-light">
                        <span>The PizzaBot invites 5 random people from your slack team out to eat Pizza. </span>
                        <span className="font-bold">Building friendships over shared love for great food {':)'}</span>
                    </span>
                    <AddToSlackButtonWhiteRounded />
                </div>
                <div className="flex w-full flex-col items-center justify-center">
                    <div className="relative">
                        <div className="mb-[-10%]">
                            <Image src={SpeachBubble} alt="Speachbubble"></Image>
                        </div>
                        <div className="absolute inset-6 z-10 flex flex-col justify-center text-green-light">
                            <span className="text-2xl">Buongiorno!</span>
                            <span className="text-xl">You 5 have been selected to go out to eat 🍕pizza!🍕</span>
                        </div>
                    </div>
                    <div className="min-w-[16rem]">
                        <Image src={Mascot} alt="Mascot"></Image>
                    </div>
                    <div className="relative ml-96 mt-[-30%]">
                        <QuoteBubbles />
                    </div>
                </div>
            </div>
            <MadeByBlank />
        </section>
    )
}

export { FirstSection }
