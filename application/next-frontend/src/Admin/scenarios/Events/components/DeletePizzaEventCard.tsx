const addOrdinalToDate = (date: string) => {
    if (date.length > 1 && date.slice(-2) === '1') return date + 'th'
    else
        switch (date.slice(-1)) {
            case '1':
                return date + 'st'
            case '2':
                return date + 'nd'
            case '3':
                return date + 'rd'
            default:
                return date + 'th'
        }
}

const DeletePizzaEventCard = () => {
    const [date, month, time] = ['17', 'September', '6:00'] // 1st, 2nd, 3rd, Nth

    return (
        <div className="h-[448px] w-[703px] rounded-[32px] border bg-[#EDFFF6] px-14 py-10">
            <div className="flex justify-between">
                <span className="font-queensRegular text-5xl text-[#05793C]">Delete Pizza Event?</span>
                <span className="m-0 cursor-pointer text-4xl font-light text-[#004B24]">&times;</span>
            </div>

            <div className="mt-14 flex font-workSans text-2xl font-semibold italic text-[#05793C]">
                <span className="w-[70%]">Date:</span>
                <span className="w-[30%]">Time</span>
            </div>

            <div className="mt-5 flex font-workSans text-3xl font-semibold">
                <span className="w-[70%]">
                    {addOrdinalToDate(date)} of {month}
                </span>
                <span className="w-[30%]">{time}</span>
            </div>

            <div className="mt-14 flex justify-evenly">
                <button className="my-4 w-[270px] border-2 border-[#2D8F5C] bg-[#CFF6E2] py-4 font-workSans text-2xl font-semibold text-[#2D8F5C] hover:bg-[#5FE09D] focus:outline-none">
                    Cancel
                </button>
                <button className="my-4 w-[270px] border-2 border-b-8 border-[#2D8F5C] bg-white py-4 font-workSans text-2xl font-black text-[#2D8F5C] hover:bg-[#FF9494] focus:outline-none">
                    Delete Event
                </button>
            </div>
        </div>
    )
}

export { DeletePizzaEventCard }
