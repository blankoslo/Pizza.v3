import ChooseChannel from 'Landing/assets/chooseChannel.svg'
import ChooseRestaurants from 'Landing/assets/chooseRestaurants.svg'
import ChooseDate from 'Landing/assets/chooseDate.svg'
import Image from 'next/image'

const ThirdSection = () => {
    return (
        <div className="relative h-[400vh] bg-green-light font-queensRegular italic">
            <div className="absolute top-20 w-full px-44">
                <div className="flex flex-col text-[88px] text-green-primary">
                    <span>Fun to use,</span>
                    <span className="-mt-8">Easy to manage</span>
                </div>

                <div className="mt-12 grid w-full grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto_1fr_auto_1fr_auto] gap-4">
                    {/* Part 1 */}
                    <div className="col-start-1 row-start-1 flex justify-end">
                        <div className="mr-8 flex max-w-[38rem] flex-col">
                            <div className="mt-12 flex">
                                <div className="flex flex-col text-[200px] leading-none text-[#9AE59D]">
                                    <span className="text-border">1.</span>
                                </div>
                                <div className="ml-4 flex flex-col text-[72px] leading-none text-green-primary">
                                    <span className=" mt-4">Choose</span>
                                    <span>Channel</span>
                                </div>
                            </div>
                            <div className="-mt-8 font-workSans text-[32px] not-italic text-[#003A1C]">
                                <span>Choose the slack channel you want the PizzaBot to appear in.</span>
                            </div>
                        </div>
                    </div>
                    {/* Part 2 */}
                    <div className="col-start-3 row-start-3 flex max-w-[38rem] flex-col pl-10">
                        <div className="mt-12 flex">
                            <div className="flex flex-col text-[200px] leading-none text-[#F0E36F]">
                                <span className="text-border">2.</span>
                            </div>
                            <div className="ml-4 flex flex-col text-[72px] leading-none text-green-primary">
                                <span className=" mt-4">Add</span>
                                <span>Restaurants</span>
                            </div>
                        </div>
                        <div className="-mt-8 font-workSans text-[32px] not-italic text-[#003A1C]">
                            <span>Let the PizzaBot know where it should invite for Pizza.</span>
                        </div>
                    </div>
                    {/* Part 3 */}
                    <div className="col-start-1 row-start-5 flex justify-end">
                        <div className="mr-8 flex max-w-[38rem] flex-col">
                            <div className="mt-12 flex">
                                <div className="flex flex-col text-[200px] leading-none text-[#F8B6B6]">
                                    <span className="text-border">3.</span>
                                </div>
                                <div className="ml-4 flex flex-col text-[72px] leading-none text-green-primary">
                                    <span className=" mt-4">Set</span>
                                    <span>Events</span>
                                </div>
                            </div>
                            <div className="-mt-8 font-workSans text-[32px] not-italic text-[#003A1C]">
                                <span>Let the PizzaBot know when to invite for Pizza.</span>
                            </div>
                        </div>
                    </div>

                    {/* Circles */}
                    <div className="col-start-2 row-start-1 flex items-center justify-center">
                        <div className="h-[64px] w-[64px] rounded-full border-[6px] border-green-primary bg-[#9AE59D]"></div>
                    </div>
                    <div className="col-start-2 row-start-3 flex items-center justify-center">
                        <div className="h-[64px] w-[64px] rounded-full border-[6px] border-green-primary bg-[#F0E36F]"></div>
                    </div>
                    <div className="col-start-2 row-start-5 flex items-center justify-center">
                        <div className="h-[64px] w-[64px] rounded-full border-[6px] border-green-primary bg-[#F8B6B6]"></div>
                    </div>

                    {/* Images */}
                    <div className="col-start-1 row-start-2 mr-8 flex justify-end">
                        <Image src={ChooseChannel} alt="Choose Slack Channel" />
                    </div>
                    <div className="col-start-3 row-start-4 pl-10">
                        <Image src={ChooseRestaurants} alt="Choose Restaurants" />
                    </div>
                    <div className="col-start-1 row-start-6 flex justify-end">
                        <Image src={ChooseDate} alt="Choose Date" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ThirdSection }
