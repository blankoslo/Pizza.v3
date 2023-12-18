import Image from 'next/image'
import HandWithTopping from 'Landing/assets/illustrations/HandWithTopping.svg'
import PizzaBotYellow from 'Landing/assets/illustrations/PizzaBotYellow.svg'
import { AddToSlackButtonWhite } from '@/Landing/components/AddToSlackButton'

const SixthSection = () => {
    return (
        <section className="flex justify-center bg-green-primary p-16 font-queensMedium lg:px-20">
            <div className="flex w-full max-w-6xl">
                <div className="flex flex-col">
                    <span className="inline-block max-w-[7em] font-queensRegular text-[60px] text-green-light lg:text-[80px]">
                        Add the PizzaBot to slack now
                    </span>
                    <div>
                        <AddToSlackButtonWhite />
                    </div>
                    <div className="ml-[200px]">
                        <Image src={HandWithTopping} alt="hand with topping" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="mb-10 mt-auto">
                        <Image src={PizzaBotYellow} alt="yellow pizza bot" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export { SixthSection }
