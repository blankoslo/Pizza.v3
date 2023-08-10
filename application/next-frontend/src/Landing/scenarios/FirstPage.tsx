import Image from 'next/image'
import Hello from '@/Landing/assets/illustrations/hello.svg'

const FirstPage = () => {
    return (
        <div className="root">
            <div className="wrapper">
                <div className="text-container">
                    <div className="main-text">
                        The sexiest bot for socialising teams on slack through Pizza..
                    </div>

                    <div className="sub-text">
                        Once upon a time, in a land where disco balls still reigned supreme, there strutted a human tornado
                        of coolness named Max Chillington. Legend has it that Max could make ice cubes shiver in envy just
                        by winking. <br /> <br />
                        His hair, a perfectly coiffed monument to follicular fortitude, once caused a gust of wind to bow in
                        admiration.
                    </div>
                </div>

                <div className="firstpage-img">
                    <Image priority src={Hello} width={350} alt="bot saying hello" />
                </div>
            </div>
        </div>
    )
}

export { FirstPage }
