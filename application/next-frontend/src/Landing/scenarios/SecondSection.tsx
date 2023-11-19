import Image from 'next/image'
import SafeEnvironments from 'Landing/assets/illustrations/SafeEnvironments.svg'
import EngagedTeams from 'Landing/assets/illustrations/EngagedTeams.svg'
import Friendships from 'Landing/assets/illustrations/Friendships.svg'
import GoodTraditions from 'Landing/assets/illustrations/GoodTraditions.svg'
import HappyMascot from 'Landing/assets/illustrations/HappyMascotLanding.svg'

const SecondSection = () => {
    return (
        <div className="relative h-[90vh] bg-green-primary">
            <div className="absolute left-32 top-20 w-8/12">
                <div className="flex flex-col gap-10">
                    <span className="font-queensMedium text-8xl text-white">
                        <i>Create an inclusive work culture</i>
                    </span>
                    <span className="max-w-2xl text-3xl font-medium text-white">
                        The pizza bot will help you build better performances and stronger teams by building:
                    </span>
                </div>
            </div>
            <div className="absolute bottom-36 left-36 ">
                <div className="flex flex-row gap-4 text-2xl font-medium text-white">
                    <section className="flex flex-col items-center">
                        <div className="h-36 w-36">
                            <Image src={SafeEnvironments} alt="Safe Environments" />
                        </div>
                        <span className="mt-2">Safe Environments</span>
                    </section>
                    <section className="flex flex-col items-center">
                        <div className="h-36 w-36">
                            <Image src={EngagedTeams} alt="Engaged Teams" />
                        </div>
                        <span className="mt-2">Engaged Teams</span>
                    </section>
                    <section className="flex flex-col items-center">
                        <div className="h-36 w-36">
                            <Image src={Friendships} alt="Friendships" />
                        </div>
                        <span className="mt-2">Friendships</span>
                    </section>
                    <section className="flex flex-col items-center">
                        <div className="h-36 w-36">
                            <Image src={GoodTraditions} alt="Good Traditions" />
                        </div>
                        <span className="mt-2">Good Traditions</span>
                    </section>
                </div>
            </div>

            <div className="absolute bottom-36 right-28">
                <div className="ml-[-5rem] h-28 w-72 bg-green-secondary p-4">
                    <span className="text-2xl font-medium text-green-tertiary ">
                        Pizza is also just <b>Delicious!!</b>
                    </span>
                </div>
                <div className="mt-[-6rem]">
                    <Image src={HappyMascot} alt="Happy Mascot" />
                </div>
            </div>
        </div>
    )
}

export { SecondSection }
