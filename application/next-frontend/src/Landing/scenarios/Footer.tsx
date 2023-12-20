import PizzaBotLogoFooter from 'Landing/assets/illustrations/PizzaBotLogoFooter.svg'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
    return (
        <div className="flex min-h-[320px] w-full flex-row justify-evenly bg-green-tertiary py-12 font-workSans text-2xl font-normal text-[#f9f9f9]">
            <div>
                <Image src={PizzaBotLogoFooter} alt="PizzaBot" />
            </div>
            <div className="flex flex-col gap-6 ">
                <span className="font-semibold underline">Links Coming Soon</span>
                <span>Our Terms</span>
                <span>Privacy Policy</span>
                <span>Data Protection</span>
            </div>
            <div className="flex flex-col gap-6">
                <span>feedback@blank.no</span>
                <span>
                    Have more questions?
                    <br /> Reach us at <span className="font-semibold">pizzabot@blank.no</span>
                </span>
                <span />
                <span className="text-green-secondary underline">
                    Made with ❤️ from{' '}
                    <Link className="font-semibold" href={'https://blank.no'}>
                        Blank AS Oslo
                    </Link>
                </span>
            </div>
        </div>
    )
}

export { Footer }
