import Image from 'next/image'
import Leaves1 from 'Landing/assets/illustrations/Leaves1.svg'
import Leaves2 from 'Landing/assets/illustrations/Leaves2.svg'
import Mathilde from 'Landing/assets/Mathilde.svg'
import Amalie from 'Landing/assets/Amalie.svg'
import Vilde from 'Landing/assets/Vilde.svg'
import { ImageWithPostit } from 'Landing/components/ImageWithPostit'

const FifthSection = () => {
    const postitTexts = [
        "PizzaBot revolutionised our team lunches, effortlessly connecting us over random pizza outings. I even met my boyfriend during one! It's the perfect blend of fun and team building.",
        "PizzaBot revolutionised our team lunches, effortlessly connecting us over random pizza outings. I even met my boyfriend during one! It's the perfect blend of fun and team building.",
        "PizzaBot revolutionised our team lunches, effortlessly connecting us over random pizza outings. I even met my boyfriend during one! It's the perfect blend of fun and team building.",
    ]

    return (
        <div className="flex bg-green-light">
            <div className="flex w-1/2 flex-col items-center">
                <span className="my-24 font-queensRegular text-7xl text-green-primary">Eat pizza</span>
                <ImageWithPostit
                    src={Vilde}
                    text={postitTexts[0]}
                    styles={{
                        tape: 'ml-72 mt-[-10px] rotate-[18deg]',
                        postit: 'ml-44 bg-postit-yellow',
                        postitHover: 'z-20 mt-14',
                        postitHoverAlternative: 'mt-16',
                    }}
                />
                <span className="ml-20 mt-6 font-queensRegular text-7xl italic text-green-primary">fun memories</span>
                <span className="ml-12 mt-2 w-80 font-workSans text-2xl text-dark">
                    Click pictures and the bot will post them in a thread in the channel!
                </span>
                <Image className="ml-14" src={Leaves1} alt="leaves 1" />
            </div>

            <div className="my-16 flex w-1/2 flex-col items-start">
                <ImageWithPostit
                    src={Mathilde}
                    text={postitTexts[1]}
                    styles={{
                        tape: 'ml-72 mt-[-20px] rotate-[9deg]',
                        postit: 'ml-44 rotate-[-2deg] bg-postit-green',
                        postitHover: 'z-20 mt-10',
                        postitHoverAlternative: 'mt-12',
                    }}
                />
                <span className="ml-10 mt-8 font-queensRegular text-7xl italic text-green-primary">& create</span>
                <Image src={Leaves2} alt="leaves 2" className="mb-8 ml-72 mt-4" />
                <ImageWithPostit
                    src={Amalie}
                    text={postitTexts[2]}
                    styles={{
                        tape: 'ml-[-20px] mt-[-40px] rotate-2',
                        postit: 'ml-[-50px] rotate-2 bg-postit-pink',
                        postitHover: 'z-20 mt-5',
                        postitHoverAlternative: 'mt-7',
                    }}
                />
            </div>
        </div>
    )
}

export { FifthSection }
