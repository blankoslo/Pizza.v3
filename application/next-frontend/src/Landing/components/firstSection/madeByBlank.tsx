import Image from 'next/image'
import BlankTextWhite from '@/Landing/assets/Blank/BlankTextWhite.svg'
import BlankTextYellow from '@/Landing/assets/Blank/BlankTextYellow.svg'
import BlankLogoWhite from '@/Landing/assets/Blank/BlankLogoWhite.svg'
import BlankLogoYellow from '@/Landing/assets/Blank/BlankLogoYellow.svg'

import { useState } from 'react'

const MadeByBlank = () => {
    const [hover, setHover] = useState(false)

    return (
        <div
            className="mb-8 flex min-h-[70px] flex-row gap-3 text-xl text-white hover:text-yellow"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Image src={hover ? BlankLogoYellow : BlankLogoWhite} alt="Blank"></Image>
            <div className="flex flex-col gap-3">
                <span>Created by</span>
                <Image src={hover ? BlankTextYellow : BlankTextWhite} alt="Blank"></Image>
            </div>
        </div>
    )
}

export { MadeByBlank }
