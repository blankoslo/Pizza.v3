const DeletePizzaEventCard = () => {
    // Pass thorugh delEvents and the date, find id to delete ?
    const [date, month, time] = ['17', 'September', '6:00']

    return (
        <div className="h-[448px] w-[703px] rounded-[32px] border bg-[#EDFFF6] p-16">
            <span className="font-queensRegular text-5xl text-[#05793C]">Delete Pizza Event?</span>
            <div className="mt-10 flex font-workSans text-2xl font-semibold italic text-[#05793C]">
                <span className="w-[70%]">Date:</span>
                <span className="w-[30%]">Time</span>
            </div>
            <div className="mt-5 flex font-workSans text-3xl font-semibold">
                <span className="w-[70%]">
                    {date}th of {month}
                </span>
                <span className="w-[30%]">{time}</span>
            </div>
            <div className="mt-32 flex">
                <button>Cancel</button>
                <button>Delete event</button>
            </div>
        </div>
    )
}

export { DeletePizzaEventCard }
