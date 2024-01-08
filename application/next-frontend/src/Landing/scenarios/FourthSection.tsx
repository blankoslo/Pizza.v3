import Image from 'next/image'
import PizzaAnnouncement from 'Landing/assets/PizzaAnnouncement.png'
import PizzaInvitation from 'Landing/assets/PizzaInvitation.png'
import PizzaBotWithFourArms from 'Landing/assets/PizzaBotWithFourArms.png'
import { AddToSlackButtonWhite } from '@/Landing/components/AddToSlackButtons'

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

                <div className="flex w-full max-w-[700px] flex-row flex-wrap">
                    <div className="-mb-6 w-full max-w-[700px]">
                        <Image src={PizzaInvitation} alt="pizza invitation in slack" />
                    </div>
                    <div className="relative min-h-[300px] min-w-[250px] flex-1">
                        <div className="absolute right-[6rem] top-20 w-[11em] bg-postit-yellow px-4 py-5 font-workSans text-lg italic leading-6 text-dark lg:right-[9rem] lg:top-40 lg:w-[16em] lg:text-xl">
                            Invites are sendt <b className="not-italic">privatly</b> on slack. So you can always
                            decline!
                        </div>
                        <Image
                            className="absolute right-0 top-0 z-10 w-[150px] max-w-[250px] lg:w-full"
                            src={PizzaBotWithFourArms}
                            alt="pizza bot with four arms"
                        />
                    </div>
                </div>

                <div className="flex w-full max-w-[700px] flex-row flex-wrap-reverse justify-end">
                    <div className="relative min-h-[300px] min-w-[250px] flex-1">
                        <div className="absolute left-[6rem] top-20 w-[11em] bg-postit-yellow px-4 py-5 font-workSans text-lg italic leading-6 text-dark lg:left-[9rem] lg:top-36 lg:w-[16em] lg:pl-16 lg:text-xl">
                            <b className="not-italic">After everyone accepts,</b> events gets posted on the choses
                            channel
                        </div>
                        <Image
                            className="absolute left-0 top-0 z-10 w-[150px] max-w-[250px] lg:w-full"
                            src={PizzaBotWithFourArms}
                            alt="pizza bot with four arms"
                        />
                    </div>
                    <div className="-mb-4 w-full max-w-[700px]">
                        <Image src={PizzaAnnouncement} alt="pizza invitation in slack" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export { FourthSection }
