import Image from 'next/image'
import PizzaAnnouncement from 'Landing/assets/PizzaAnnouncement.png'
import PizzaInvitation from 'Landing/assets/PizzaInvitation.png'
import PizzaBotWithFourArms from 'Landing/assets/PizzaBotWithFourArms.png'

const FourthSection = () => {
    return (
        <section className="flex items-center justify-center bg-green-primary p-16 lg:px-20">
            <div className="flex w-full max-w-6xl flex-col items-center gap-16 text-white">
                <div className="w-full">
                    <span className="inline-block max-w-[10em] font-queensRegular text-7xl">
                        Picks 5 people from the slack channel randomly...
                    </span>
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

            {/* <div className="mb-20 flex justify-center">
                <Image height={500} src={PizzaInvitation} alt="pizza invitation in slack" />
                <div className="relative flex items-end">
                    <div className="absolute bottom-[18px] left-[56%] h-20 w-52 bg-green-secondary p-1 pl-10 font-workSans text-xl italic leading-6 text-dark">
                        The Pizza Bot sends you a private invitation
                    </div>
                    <Image height={300} className="z-10" src={PizzaBotWithFourArms} alt="pizza bot with four arms" />
                </div>
            </div>

            <div className="mb-40 flex justify-center">
                <div className="relative flex items-end">
                    <div className="absolute bottom-[18px] right-[53%] h-[135px] w-60 bg-green-secondary p-2 pr-16 font-workSans text-xl italic leading-6 text-dark">
                        After five people accept, the plan is posted publicly in your chosen channel
                    </div>
                    <Image height={300} className="z-10" src={PizzaBotWithFourArms} alt="pizza bot with four arms" />
                </div>
                <Image height={500} src={PizzaAnnouncement} alt="pizza announcement in slack" />
            </div> */}
        </section>
    )
}

export { FourthSection }
