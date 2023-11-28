import Image from 'next/image'
import Leaves1 from 'Landing/assets/illustrations/Leaves1.svg'
import Leaves2 from 'Landing/assets/illustrations/Leaves2.svg'
import Mathilde from 'Landing/assets/Mathilde.svg'
import Vilde from 'Landing/assets/Vilde.svg'
import Amalie from 'Landing/assets/Amalie.svg'

import { Postit } from 'Landing/components/Postit'

const FifthSection = () => {
    const postitTexts = [
        "PizzaBot revolutionised our team lunches, effortlessly connecting us over random pizza outings. I even met my boyfriend during one! It's the perfect blend of fun and team building.",
        "PizzaBot revolutionised our team lunches, effortlessly connecting us over random pizza outings. I even met my boyfriend during one! It's the perfect blend of fun and team building.",
        "PizzaBot revolutionised our team lunches, effortlessly connecting us over random pizza outings. I even met my boyfriend during one! It's the perfect blend of fun and team building!",
    ]

    return (
        <div className="flex bg-green-light">
            <div className="flex w-1/2 flex-col items-center">
                <span className="my-24 font-queensRegular text-7xl text-green-primary">Eat pizza</span>
                <div className="relative flex">
                    <Image src={Vilde} alt="fun" className="z-10 hover:z-0" />
                    <Postit text={postitTexts[0]} className="ml-44 mt-7 bg-postit-yellow" />
                </div>
                <span className="ml-20 mt-6 font-queensRegular text-7xl italic text-green-primary">fun memories</span>
                <span className="ml-12 mt-2 w-80 font-workSans text-2xl text-dark">
                    Click pictures and the bot will post them in a thread in the channel!
                </span>
                <Image className="ml-14" src={Leaves1} alt="leaves 1" />
            </div>

            <div className="my-16 flex w-1/2 flex-col">
                <div className="relative flex">
                    <Image src={Mathilde} alt="fun" className="z-10 hover:z-0" />
                    <Postit text={postitTexts[1]} className="ml-44 mt-12 rotate-[-2deg] bg-postit-green" />
                </div>
                <span className="ml-10 mt-8 font-queensRegular text-7xl italic text-green-primary">& create</span>
                <Image src={Leaves2} alt="leaves 2" className="mb-8 ml-72 mt-4" />
                <div className="relative flex">
                    <Image src={Amalie} alt="fun" className="z-10 hover:z-0" />
                    <Postit text={postitTexts[2]} className="ml-[-50px] mt-7 rotate-2 bg-postit-pink hover:mt-5" />
                </div>
            </div>
        </div>
    )
}

export { FifthSection }
