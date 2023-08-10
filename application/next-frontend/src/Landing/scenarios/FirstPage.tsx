import Image from 'next/image'
import Hello from '@/Landing/assets/illustrations/hello.svg'
// import { inter, spaceGoretsk } from "@/_app"

const FirstPage = () => {
    return (
        <div className="flex h-fit justify-center bg-teal-400 pb-12">
            <div className="flex w-4/5">
                <div className="flex w-1/2 flex-col">
                    <div className="font-spaceGrotesk mb-5 text-6xl text-gray-900 leading-[4rem]">
                        The sexiest bot for socialising teams on slack through Pizza..
                    </div>

                    <div className="font-inter text-xl leading-7 text-black">
                        Once upon a time, in a land where disco balls still reigned supreme, there strutted a human
                        tornado of coolness named Max Chillington. Legend has it that Max could make ice cubes shiver in
                        envy just by winking. <br /> <br />
                        His hair, a perfectly coiffed monument to follicular fortitude, once caused a gust of wind to
                        bow in admiration.
                    </div>
                </div>

                {/* problem: my-auto doesnt care about padding on bottom */}
                <div className="m-auto">
                    <Image priority src={Hello} width={450} alt="bot saying hello" />
                </div>
            </div>
        </div>
    )
}

export { FirstPage }
