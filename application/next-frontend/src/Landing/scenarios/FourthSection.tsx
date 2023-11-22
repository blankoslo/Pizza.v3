import Image from 'next/image'
import PizzaAnnouncement from 'Landing/assets/PizzaAnnouncement.svg'
import PizzaInvitation from 'Landing/assets/PizzaInvitation.svg'
import PizzaBotWithFourArms from 'Landing/assets/PizzaBotWithFourArms.svg'

const FourthSection = () => {
    return (
        <div className="flex flex-col bg-green-primary">
            <span className="my-28 ml-28 w-1/2 font-queensRegular text-7xl text-white">
                The PizzaBot randomly picks 5 people from your slack team
            </span>

            <div className="mb-20 flex justify-center">
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
            </div>
        </div>
    )
}

export { FourthSection }
