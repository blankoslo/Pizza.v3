import Image from 'next/image'
import Line from 'Landing/assets/Line.svg'
import { AddToSlackButton } from '@/Landing/components/AddToSlackButtons'

const FirstSection = () => {
    return (
        <section className="flex min-h-[80vh] flex-col items-center bg-green-light lg:max-h-[80vh]">
            <span className="mt-12 text-center font-queensMedium text-9xl text-green-primary">
                A slice to <i>socialise</i>
            </span>
            <Image height={5.5} src={Line} alt="dotted line" />
            <span className="mb-5 mt-16 w-1/3 text-center text-3xl font-medium leading-9 text-green-tertiary">
                Download the PizzaBot to build better work environments.
            </span>
            <AddToSlackButton />
        </section>
    )
}

export { FirstSection }
