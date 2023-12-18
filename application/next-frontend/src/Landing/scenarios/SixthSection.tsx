import Image from 'next/image'
import HandWithTopping from 'Landing/assets/illustrations/HandWithTopping.svg'
import PizzaBotYellow from 'Landing/assets/illustrations/PizzaBotYellow.svg'
import { AddToSlackButtonWhite } from '@/Landing/components/AddToSlackButton'

const SixthSection = () => {
    return (
        <div className="flex bg-green-primary">
            <div className="flex w-[60%] flex-col">
                <span className="mb-6 ml-64 mt-10 font-queensRegular text-[60px] italic text-green-light lg:text-[80px]">
                    Add the PizzaBot to slack now
                </span>
                <div className="mb-3 ml-64">
                    <AddToSlackButtonWhite />
                </div>
                <div className="ml-[400px]">
                    <Image src={HandWithTopping} alt="hand with topping" />
                </div>
            </div>
            <div className="flex justify-end">
                <div className="mb-10 mt-auto">
                    <Image src={PizzaBotYellow} alt="yellow pizza bot" />
                </div>
            </div>
        </div>
    )
}

export { SixthSection }
