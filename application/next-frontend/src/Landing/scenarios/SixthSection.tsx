import Image from 'next/image'
import HandWithTopping from 'Landing/assets/illustrations/HandWithTopping.svg'
import PizzaBotYellow from 'Landing/assets/illustrations/PizzaBotYellow.svg'
import { AddToSlackButtonWhite } from '@/Landing/components/AddToSlackButtons'

const SixthSection = () => {
    return (
        <section className="flex justify-center bg-green-primary px-16 pt-16 font-queensMedium lg:px-20">
            <div className="flex w-full max-w-[1500px] flex-col lg:flex-row">
                <div className="order-1 flex flex-1 flex-col">
                    <span className="font-queensRegular text-[60px] text-green-light lg:text-[80px]">
                        Add the PizzaBot to slack now
                    </span>
                    <div className="mt-4">
                        <AddToSlackButtonWhite />
                    </div>
                    <div className="ml-[100px] lg:ml-[200px]">
                        <Image src={HandWithTopping} alt="hand with topping" className="w-[10rem] lg:w-[15rem]" />
                    </div>
                </div>
                <div className="order-2 my-8 flex flex-1 justify-center">
                    <Image src={PizzaBotYellow} alt="yellow pizza bot" className="w-[25rem] min-w-[10rem]" />
                </div>
            </div>
        </section>
    )
}

export { SixthSection }
