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

                <div className="mt-12 grid w-full grid-cols-[1fr_auto] grid-rows-[1fr_auto_1fr_auto_1fr_auto] gap-4 lg:grid-cols-[1fr_auto_1fr]">
                    {/* Part 1 */}
                    <div className="col-start-1 row-start-1 flex lg:justify-end">
                        <div className="mr-8 flex max-w-[38rem] flex-col">
                            <div className="mt-12 flex">
                                <div className="flex flex-col text-[130px] italic leading-none text-[#9AE59D] lg:text-[200px]">
                                    <span className="text-border">1.</span>
                                </div>
                                <div className="ml-4 flex flex-col text-[52px] italic leading-none text-green-primary lg:text-[72px]">
                                    <span className="mt-4">Choose</span>
                                    <span>Channel</span>
                                </div>
                            </div>
                            <div className="font-workSans text-[24px] text-[#003A1C] lg:-mt-8 lg:text-[28px]">
                                <span>Choose the slack channel you want the PizzaBot to send invites on.</span>
                            </div>
                        </div>
                    </div>
                    {/* Part 2 */}
                    <div className="col-start-1 row-start-3 flex max-w-[38rem] flex-col lg:col-start-3 lg:pl-10">
                        <div className="mt-12 flex">
                            <div className="flex flex-col text-[130px] italic leading-none text-[#F0E36F] lg:text-[200px]">
                                <span className="text-border">2.</span>
                            </div>
                            <div className="ml-4 flex flex-col text-[52px] italic leading-none text-green-primary lg:text-[72px]">
                                <span className="mt-4">Add</span>
                                <span>Restaurants</span>
                            </div>
                        </div>
                        <div className="font-workSans text-[24px] text-[#003A1C] lg:-mt-8 lg:text-[28px]">
                            <span>The PizzaBot chooses from one of the restaurants added.</span>
                        </div>
                    </div>
                    {/* Part 3 */}
                    <div className="col-start-1 row-start-5 flex lg:justify-end">
                        <div className="mr-8 flex max-w-[38rem] flex-col">
                            <div className="mt-12 flex">
                                <div className="flex flex-col text-[130px] italic leading-none text-[#F8B6B6] lg:text-[200px]">
                                    <span className="text-border">3.</span>
                                </div>
                                <div className="ml-4 flex flex-col text-[52px] italic leading-none text-green-primary lg:text-[72px]">
                                    <span className=" mt-4">Set</span>
                                    <span>Events</span>
                                </div>
                            </div>
                            <div className="font-workSans text-[24px] text-[#003A1C] lg:-mt-8 lg:text-[28px]">
                                <span>The PizzaBot sets up the event after you pick date & time</span>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="col-start-1 row-start-2 mr-8 flex w-full max-w-[500px] justify-end">
                        <Image src={ChooseChannel} alt="Choose Slack Channel" />
                    </div>
                    <div className="col-start-1 row-start-4 w-full max-w-[500px] pl-10 lg:col-start-3">
                        <Image src={ChooseRestaurants} alt="Choose Restaurants" />
                    </div>
                    <div className="col-start-1 row-start-6 flex w-full max-w-[550px] justify-end">
                        <Image src={ChooseDate} alt="Choose Date" />
                    </div>

                    <div className="col-start-1 row-start-7 mt-8 flex">
                        <AddToSlackButton />
                    </div>
                </div>
            </div>
        </section>
    )
}

export { ThirdSection }
