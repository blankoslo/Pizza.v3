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
                <span className="ml-[20%] font-queensMedium text-8xl italic text-white">
                    Build a work culture with PizzaBot and create...
                </span>
            </div>
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 gap-4 font-queensRegular text-2xl text-white md:mt-[-20%] md:grid-flow-col md:grid-rows-2">
                    <ImageContainer img={SafeEnvironments} text="Safe Environments" />
                    <ImageContainer img={EngagedTeams} text="Engaged Teams" />
                    <ImageContainer img={Friendships} text="Friendship" />
                    <ImageContainer img={GoodTraditions} text="Good Traditions" />
                </div>
            </div>
            <div className="flex items-center justify-center md:row-span-2 md:mr-[20rem] ">
                <HappyMascot />
            </div>
        </section>
    )
}

export { SecondSection }
