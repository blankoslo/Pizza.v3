import { Header } from './scenarios/Header'
import { FirstSection } from './scenarios/FirstSection'
import { SecondSection } from './scenarios/SecondSection'
import { ThirdSection } from './scenarios/ThirdSection'
import { FourthSection } from './scenarios/FourthSection'
import { FifthSection } from './scenarios/FifthSection'
import { SixthSection } from './scenarios/SixthSection'
import { Footer } from './scenarios/Footer'

const Landing = () => {
    return (
        <>
            <div className="custom-cursor">
                <Header />
                <FirstSection />
            </div>
            <SecondSection />
            <ThirdSection />
            <FourthSection />
            <FifthSection />
            <SixthSection />
            <Footer />
        </>
    )
}

export { Landing }
