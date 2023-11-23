import SafeEnvironments from 'Landing/assets/illustrations/SafeEnvironments.svg'
import EngagedTeams from 'Landing/assets/illustrations/EngagedTeams.svg'
import Friendships from 'Landing/assets/illustrations/Friendships.svg'
import GoodTraditions from 'Landing/assets/illustrations/GoodTraditions.svg'
import HappyMascot from 'Landing/assets/illustrations/HappyMascotLanding.svg'
import { ImageContainer } from 'Landing/components/secondSection/ImageContainer'
import Image from 'next/image'

const SecondSection = () => {
    return (
        <section className="h-[90vh] bg-green-primary">
            <div className="h-[20%] w-[100%]">
                <span className="ml-[10%] mt-[20%] font-queensMedium text-8xl italic text-white">
                    Create an inclusive work culture
                </span>
            </div>
            <div className="flex h-[80%] w-[100%] flex-row">
                <div className="flex flex-col">
                    <div className="flex h-[50%] items-center justify-center">
                        <span className="w-[70%] font-queensRegular text-5xl text-white">
                            The pizza bot will help you build better performances and stronger teams by building:
                        </span>
                    </div>
                    <div className="flex flex-wrap place-content-center gap-4  font-queensRegular text-4xl text-white ">
                        <ImageContainer img={SafeEnvironments} text="Safe Environments" />
                        <ImageContainer img={EngagedTeams} text="Engaged Teams" />
                        <ImageContainer img={Friendships} text="Friendship" />
                        <ImageContainer img={GoodTraditions} text="Good Traditions" />
                    </div>
                </div>
                <div className="w-[40%]">
                    <Image src={HappyMascot} alt="Happy Mascot" />
                </div>
            </div>
        </section>
    )
}

export { SecondSection }
