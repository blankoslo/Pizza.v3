const NextEventInfo = ({
    event_id,
    resturantName,
    date,
    time,
    meridiem,
}: {
    event_id: string
    resturantName: string
    date: string
    time: string
    meridiem: string
}) => {
    console.log(event_id)
    return (
        <div className="mt-5 flex flex-col">
            <div className="italic text-green-primary">Next event:</div>
            <h3 className="text-2xl font-semibold leading-10">{resturantName}</h3>
            <h4 className="text-xl font-semibold leading-10">{date}</h4>
            <span className="text-xl font-semibold leading-7">
                {time} <span className="italic">{meridiem}</span>
            </span>
        </div>
    )
}

export { NextEventInfo }
