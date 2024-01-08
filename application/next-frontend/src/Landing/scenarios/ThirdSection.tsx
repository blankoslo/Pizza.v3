import ChooseChannel from 'Landing/assets/chooseChannel.svg'
import ChooseRestaurants from 'Landing/assets/chooseRestaurants.svg'
import ChooseDate from 'Landing/assets/chooseDate.svg'
import Image from 'next/image'
import { AddToSlackButton } from '@/Landing/components/AddToSlackButtons'

const ThirdSection = () => {
    return (
        <section className="flex justify-center bg-green-light p-16 font-queensMedium lg:px-20 ">
            <div className="flex w-full max-w-[1500px] flex-col lg:w-fit">
                <div className="w-full">
                    <span className="inline-block max-w-[5em] font-queensRegular text-[60px] text-green-primary lg:text-[88px]">
                        Fun to use, Easy to setup
                    </span>
                </div>
                <div className="font-workSans text-[24px]  text-[#003A1C] lg:-mt-8 lg:text-[32px]">
                    <span>After you add this to Slack..</span>
                </div>

                <div className="mt-12 grid w-full grid-cols-1 grid-rows-3 gap-4 lg:grid-cols-2">
                    {/* Part 1 */}
                    <div className="flex lg:justify-end">
                        <div className="mr-8 flex max-w-[38rem] flex-col">
                            <div className="mt-12 flex">
                                <div className="flex flex-col text-[100px] italic leading-none text-[#9AE59D] lg:text-[200px]">
                                    <span className="text-border">1.</span>
                                </div>
                                <div className="ml-4 flex flex-col text-[45px] italic leading-none text-green-primary lg:text-[72px]">
                                    <span className="mt-0 lg:mt-4">Choose</span>
                                    <span>Channel</span>
                                </div>
                            </div>
                            <div className="font-workSans text-[24px] text-[#003A1C] lg:-mt-8 lg:text-[28px]">
                                <span>Choose the slack channel you want the PizzaBot to send invites on.</span>
                            </div>

                            <Image src={ChooseChannel} alt="Choose Slack Channel" />
                        </div>
                    </div>
                    {/* Part 2 */}
                    <div className="col-start-1 row-start-2 flex max-w-[38rem] flex-col lg:col-start-2 lg:pl-10">
                        <div className="mt-12 flex">
                            <div className="flex flex-col text-[100px] italic leading-none text-[#F0E36F] lg:text-[200px] ">
                                <span className="text-border">2.</span>
                            </div>
                            <div className="ml-4 flex flex-col text-[45px] italic leading-none text-green-primary lg:text-[72px]">
                                <span className="mt-0 lg:mt-4">Add</span>
                                <span>Restaurants</span>
                            </div>
                        </div>
                        <div className="font-workSans text-[24px] text-[#003A1C] lg:-mt-8 lg:text-[28px]">
                            <span>The PizzaBot chooses from one of the restaurants added.</span>
                        </div>
                        <Image src={ChooseRestaurants} alt="Choose Restaurants" />
                    </div>
                    {/* Part 3 */}
                    <div className="col-start-1 row-start-3 flex lg:justify-end">
                        <div className="mr-8 flex max-w-[38rem] flex-col">
                            <div className="mt-12 flex">
                                <div className="flex flex-col text-[100px] italic leading-none text-[#F8B6B6] lg:text-[200px]">
                                    <span className="text-border">3.</span>
                                </div>
                                <div className="ml-4 flex flex-col text-[45px] italic leading-none text-green-primary lg:text-[72px]">
                                    <span className="mt-0 lg:mt-4">Set</span>
                                    <span>Events</span>
                                </div>
                            </div>
                            <div className="font-workSans text-[24px] text-[#003A1C] lg:-mt-8 lg:text-[28px]">
                                <span>The PizzaBot sets up the event after you pick date & time</span>
                            </div>
                            <Image src={ChooseDate} alt="Choose Date" />
                        </div>
                    </div>

                    {/* Images */}

                    <div className="col-start-1 row-start-7 mt-8 flex">
                        <AddToSlackButton />
                    </div>
                </div>
            </div>
        </section>
    )
}

export { ThirdSection }
