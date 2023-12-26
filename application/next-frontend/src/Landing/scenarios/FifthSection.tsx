import Mathilde from 'Landing/assets/Mathilde.svg'
import Amalie from 'Landing/assets/Amalie.svg'
import Vilde from 'Landing/assets/Vilde.svg'
import { ImageWithPostit } from 'Landing/components/ImageWithPostit'
import { AddToSlackButton } from '../components/AddToSlackButtons'

const FifthSection = () => {
    const postitTexts = [
        "PizzaBot revolutionised our team lunches, effortlessly connecting us over random pizza outings. I even met my boyfriend during one! It's the perfect blend of fun and team building.",
        "PizzaBot revolutionised our team lunches, effortlessly connecting us over random pizza outings. I even met my boyfriend during one! It's the perfect blend of fun and team building.",
        "PizzaBot revolutionised our team lunches, effortlessly connecting us over random pizza outings. I even met my boyfriend during one! It's the perfect blend of fun and team building.",
    ]

    return (
        <section className="flex items-center justify-center bg-green-light p-16 lg:px-20 ">
            <div className="w-full max-w-[1500px] text-green-primary">
                {/* grid def */}
                <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-2">
                    <div className="flex w-full flex-col items-center justify-center font-queensRegular text-[60px] lg:text-[75px]">
                        <div className="flex flex-col font-[500]">
                            <span className="inline-block">Create</span>
                            <span className="inline-block">
                                <i>fun</i> memories
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <ImageWithPostit
                            src={Mathilde}
                            text={postitTexts[1]}
                            styles={{
                                tape: '-rotate-[9deg] -left-8',
                                postit: ' -left-8 top-4 rotate-[-2deg] bg-postit-green',
                                postitHover: 'z-20 mt-10',
                                postitHoverAlternative: 'mt-12',
                            }}
                        />
                    </div>
                    <div className="mt-44 flex items-center justify-center lg:mt-0">
                        <ImageWithPostit
                            src={Vilde}
                            text={postitTexts[0]}
                            styles={{
                                tape: '-right-4 rotate-[18deg]',
                                postit: ' -top-4 -right-8 bg-postit-yellow rotate-[3deg]',
                                postitHover: 'z-20 mt-14',
                                postitHoverAlternative: 'mt-16',
                            }}
                        />
                    </div>
                    <div className="row-start-6 mt-44 flex items-center justify-center font-workSans lg:row-start-[unset] lg:mt-0">
                        <div className="flex w-full max-w-[15em] flex-col gap-8 text-2xl">
                            <span className="text-black ">
                                Explore <b>PizzaBot premium</b> to gather pictures from pizza events, along with many
                                other fun features{' '}
                            </span>
                            <AddToSlackButton />
                        </div>
                    </div>
                    <div></div>
                    <div className="mt-44 flex items-center justify-center lg:mt-0">
                        <ImageWithPostit
                            src={Amalie}
                            text={postitTexts[2]}
                            styles={{
                                tape: '-left-4 rotate-[-6deg]',
                                postit: '-left-8 top-8 rotate-2 bg-postit-pink',
                                postitHover: 'z-20 mt-5',
                                postitHoverAlternative: 'mt-7',
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export { FifthSection }
