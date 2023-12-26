import SafeEnvironments from 'Landing/assets/illustrations/SafeEnvironments.svg'
import EngagedTeams from 'Landing/assets/illustrations/EngagedTeams.svg'
import Friendships from 'Landing/assets/illustrations/Friendships.svg'
import GoodTraditions from 'Landing/assets/illustrations/GoodTraditions.svg'
import HappyMascot from 'Landing/assets/illustrations/HappyMascotLanding.svg'
import { ImageContainer } from 'Landing/components/secondSection/ImageContainer'
import Image from 'next/image'
import { AddToSlackButtonWhite } from '@/Landing/components/AddToSlackButtons'

const SecondSection = () => {
    return (
        <section className="flex min-h-[100vh] items-center justify-center bg-green-primary p-16 lg:px-20">
            <div className="flex w-full max-w-[1500px] flex-col italic text-white">
                {/* Title */}
                <div className="w-full font-queensRegular text-[60px] lg:text-[88px]">
                    <span className="inline-block max-w-[10em]">
                        Build a work culture with the PizzaBot and create...
                    </span>
                </div>
                <div className="flex w-full flex-row justify-around">
                    {/* Grid def */}
                    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Icon grid */}
                        <div className="grid grid-cols-2 grid-rows-2 gap-4 text-center font-workSans text-2xl lg:px-12">
                            <div className="flex items-center justify-center">
                                <ImageContainer img={SafeEnvironments} text="Safe Environments" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ImageContainer img={EngagedTeams} text="Engaged Teams" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ImageContainer img={GoodTraditions} text="Good Traditions" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ImageContainer img={Friendships} text="Friendship" />
                            </div>
                        </div>

                        {/* Bot icon */}
                        <div className="flex flex-1 justify-end">
                            <Image src={HappyMascot} alt="Happy Mascot" className="w-[30rem] min-w-[17rem]" />
                        </div>
                        <AddToSlackButtonWhite />
                    </div>
                </div>
            </div>
        </section>
    )
}

export { SecondSection }
