import Image from 'next/image'
import PizzaAnnouncement from 'Landing/assets/PizzaAnnouncement.png'
import PizzaInvitation from 'Landing/assets/PizzaInvitation.png'
import PizzaBotWithFourArms from 'Landing/assets/PizzaBotWithFourArms.png'
import { AddToSlackButtonWhite } from '@/Landing/components/AddToSlackButton'

const FourthSection = () => {
    return (
        <section className="flex items-center justify-center bg-green-primary p-16 lg:px-20">
            <div className="flex w-full max-w-[1500px] flex-col items-center gap-16 text-white">
                <div className="w-full gap-4">
                    <span className="inline-block max-w-[14em] font-queensRegular text-[60px] text-green-light lg:text-[88px]">
                        The PizzaBot picks 5 people from the slack channel randomly..
                    </span>
                    <div className="font-workSans text-[24px] text-light lg:text-[32px]">
                        <span>and invites them for an event</span>
                    </div>
                    <div className="my-10">
                        <AddToSlackButtonWhite />
                    </div>
                </div>

                <div className="flex flex-row flex-wrap">
                    <div className="w-full max-w-[700px] pb-24">
                        <Image src={PizzaInvitation} alt="pizza invitation in slack" />
                    </div>
                    <div className="relative min-h-[150px] min-w-[250px] flex-1">
                        <div className="absolute bottom-4 right-[9rem] w-[16em] bg-postit-yellow py-4 pl-4 pr-16 font-workSans text-xl italic leading-6 text-dark">
                            Invites are sendt <b className="not-italic">privatly</b> on slack. So you can always
                            decline!
                        </div>
                        <Image
                            className="absolute bottom-0 right-0 z-10"
                            width={250}
                            src={PizzaBotWithFourArms}
                            alt="pizza bot with four arms"
                        />
                    </div>
                </div>

                <div className="flex flex-row flex-wrap-reverse justify-end">
                    <div className="relative min-h-[150px] min-w-[250px] flex-1">
                        <div className="absolute bottom-4 left-[9rem] w-[16em] bg-postit-yellow py-4 pl-16 pr-4 font-workSans text-xl italic leading-6 text-dark">
                            <b className="not-italic">After everyone accepts,</b> events gets posted on the choses
                            channel
                        </div>
                        <Image
                            className="absolute bottom-0 left-0 z-10"
                            width={250}
                            src={PizzaBotWithFourArms}
                            alt="pizza bot with four arms"
                        />
                    </div>
                    <div className="w-full max-w-[700px] pb-24">
                        <Image src={PizzaAnnouncement} alt="pizza invitation in slack" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export { FourthSection }
