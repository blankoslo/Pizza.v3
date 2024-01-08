import PizzaBotLogoFooter from 'Landing/assets/illustrations/PizzaBotLogoFooter.svg'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="flex items-center justify-center bg-green-tertiary p-12 lg:px-10">
            <div className="flex min-h-[320px] w-full max-w-[1500px] flex-col justify-evenly gap-16 font-workSans text-2xl font-normal text-[#f9f9f9] lg:flex-row lg:gap-0">
                <div>
                    <Image src={PizzaBotLogoFooter} alt="PizzaBot" />
                </div>
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-1">
                    <span className="font-semibold underline">Links Coming Soon</span>
                    <span>Our Terms</span>
                    <span>Privacy Policy</span>
                    <span>Data Protection</span>
                </div>
                <div className="flex flex-col gap-3 lg:gap-6">
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
        </footer>
    )
}

export { Footer }
