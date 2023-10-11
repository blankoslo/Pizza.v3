import Image from 'next/image'
import TriangleGreen from 'Admin/assets/TriangleGreen.svg'
import TriangleGrey from 'Admin/assets/TriangleGrey.svg'
import { useState } from 'react'

const CreatePizzaEventCard = () => {
    const [date, month, time] = ['17', 'September', '6:00']
    const leftArrowGreen = <Image className="rotate-180 cursor-pointer" src={TriangleGreen} alt="previous month" />
    const rightArrowGreen = <Image className="cursor-pointer" src={TriangleGreen} alt="previous month" />
    const leftArrowGrey = <Image className="cursor-pointer" src={TriangleGrey} alt="previous month" />
    const rightArrowGrey = <Image className="rotate-180 cursor-pointer" src={TriangleGrey} alt="previous month" />

    const [leftTriangle, setLeftTriangle] = useState(leftArrowGrey)
    const [rightTriangle, setRightTriangle] = useState(rightArrowGreen)

    const handleLastClicked = (direction: string) => {
        if (direction === 'right') {
            setRightTriangle(rightArrowGreen)
            setLeftTriangle(leftArrowGrey)
            // and update current month for req purposes
        } else {
            setLeftTriangle(leftArrowGreen)
            setRightTriangle(rightArrowGrey)
            // and update current month for req purposes
        }
    }

    return (
        <div className="h-[448px] w-[703px] rounded-[32px] border bg-[#EDFFF6] px-14 py-10">
            <div className="flex justify-between">
                <span className="font-queensRegular text-5xl text-[#05793C]">Create Pizza Event?</span>
                <span className="m-0 cursor-pointer text-4xl font-light text-[#004B24]">&times;</span>
            </div>

            <div className="mt-14 flex font-workSans text-2xl font-semibold italic text-[#05793C]">
                <span className="w-[65%]">Date:</span>
                <span className="w-[35%]">Time</span>
            </div>

            <div className="mt-5 flex font-workSans text-4xl font-semibold [&>*]:border-2 [&>*]:border-dotted [&>*]:border-[#94DBB6] ">
                <span className="p-3 text-[#003F1E]">{date}.</span>
                <div className="ml-2 flex p-3">
                    <div className="my-auto mr-2" onClick={() => handleLastClicked('left')}>
                        {leftTriangle}
                    </div>
                    <span className="text-[#003F1E]">{month}</span>
                    <div className="my-auto ml-2" onClick={() => handleLastClicked('right')}>
                        {rightTriangle}
                    </div>
                </div>
                <span className="ml-6 p-3 text-[#004B24]">{time}</span>
            </div>

            <div className="mt-14 flex justify-evenly">
                <button className="my-4 w-[270px] border-2 border-[#2D8F5C] bg-[#CFF6E2] py-4 font-workSans text-2xl font-semibold text-[#2D8F5C] hover:bg-[#5FE09D] focus:outline-none">
                    Cancel
                </button>
                <button className="my-4 w-[270px] border-2 border-b-8 border-[#2D8F5C] bg-white py-4 font-workSans text-2xl font-black text-[#2D8F5C] hover:bg-[#FF9494] focus:outline-none">
                    Create Event
                </button>
            </div>
        </div>
    )
}

export { CreatePizzaEventCard }
