import SafeEnvironments from 'Landing/assets/illustrations/SafeEnvironments.svg'
import EngagedTeams from 'Landing/assets/illustrations/EngagedTeams.svg'
import Friendships from 'Landing/assets/illustrations/Friendships.svg'
import GoodTraditions from 'Landing/assets/illustrations/GoodTraditions.svg'
import HappyMascot from 'Landing/assets/illustrations/HappyMascotLanding.svg'
import { ImageContainer } from 'Landing/components/secondSection/ImageContainer'
import Image from 'next/image'

const SecondSection = () => {
    return (
        <section className="flex min-h-[90vh] flex-col justify-around gap-16 bg-green-primary p-16 px-20 lg:gap-8">
            <div className="w-full">
                <span className="font-queensRegular text-7xl italic text-white">Create an inclusive work culture</span>
            </div>
            <div className="flex w-full flex-row items-center">
                <div className="flex flex-col gap-4">
                    <div className="flex h-[50%] items-center">
                        <span className="w-[70%] font-queensRegular text-4xl text-white">
                            The pizza bot will help you build better performances and stronger teams by building:
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 font-queensRegular text-2xl text-white">
                        <div className="flex flex-row gap-4">
                            <ImageContainer img={SafeEnvironments} text="Safe Environments" />
                            <ImageContainer img={EngagedTeams} text="Engaged Teams" />
                        </div>
                        <div className="flex flex-row gap-4">
                            <ImageContainer img={Friendships} text="Friendship" />
                            <ImageContainer img={GoodTraditions} text="Good Traditions" />
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <Image src={HappyMascot} alt="Happy Mascot" />
                </div>
            </div>
        </section>
    )
}

export { SecondSection }
