import SafeEnvironments from 'Landing/assets/illustrations/SafeEnvironments.svg'
import EngagedTeams from 'Landing/assets/illustrations/EngagedTeams.svg'
import Friendships from 'Landing/assets/illustrations/Friendships.svg'
import GoodTraditions from 'Landing/assets/illustrations/GoodTraditions.svg'
import { HappyMascot } from 'Landing/components/secondSection/HappyMascot'
import { ImageContainer } from 'Landing/components/secondSection/ImageContainer'

const SecondSection = () => {
    return (
        <section className="flex h-[100vh] flex-col gap-1 bg-green-primary md:grid md:grid-flow-col md:grid-rows-2">
            <div className="flex items-center justify-center md:w-8/12">
                <span className="ml-8 font-queensMedium text-8xl text-white">
                    <i>Build a work cultrue with PizzaBot and create...</i>
                </span>
            </div>
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 gap-4 text-2xl font-medium text-white md:mt-[-4rem] md:grid-flow-col md:grid-rows-2">
                    <ImageContainer img={SafeEnvironments} text="Safe Environments" />
                    <ImageContainer img={EngagedTeams} text="Engaged Teams" />
                    <ImageContainer img={Friendships} text="Friendship" />
                    <ImageContainer img={GoodTraditions} text="Good Traditions" />
                </div>
            </div>
            <div className="flex items-center justify-center md:row-span-2 md:mr-8 ">
                <HappyMascot />
            </div>
        </section>
    )
}

export { SecondSection }
