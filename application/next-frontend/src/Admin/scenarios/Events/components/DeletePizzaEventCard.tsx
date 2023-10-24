import { useModal } from '@/Admin/context/ModelContext'
import { ApiEvent, useEvents } from '@/api/useEvents'
import ordinal from 'ordinal'

const DeletePizzaEventCard = (event: ApiEvent) => {
    const eventDate = new Date(event.time)
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Date(0, i).toLocaleString('en-UK', { month: 'long' })
    })
    const [date, month, time] = [
        eventDate.getDate(),
        eventDate.getMonth(),
        `${eventDate.getHours()}:${eventDate.getMinutes()}`,
    ]
    const { delEvent } = useEvents()
    const { closeModal } = useModal()

    return (
        <div className="h-[448px] w-[703px] rounded-[32px] border bg-[#EDFFF6] px-14 py-10">
            <div className="flex justify-between">
                <span className="font-queensRegular text-5xl text-[#05793C]">Delete Pizza Event?</span>
                <span className="m-0 cursor-pointer text-4xl font-light text-[#004B24]" onClick={() => closeModal()}>
                    &times;
                </span>
            </div>

            <div className="mt-14 flex font-workSans text-2xl font-semibold italic text-[#05793C]">
                <span className="w-[70%]">Date:</span>
                <span className="w-[30%]">Time</span>
            </div>

            <div className="mt-5 flex font-workSans text-3xl font-semibold">
                <span className="w-[70%]">
                    {ordinal(date)} of {months[month]}
                </span>
                <span className="w-[30%]">{time}</span>
            </div>

            <div className="mt-14 flex justify-evenly">
                <button
                    className="my-4 w-[270px] border-2 border-[#4E5445] py-4 font-workSans text-2xl font-semibold text-[#4E5445] hover:bg-[#FFF8C1] focus:outline-none"
                    onClick={() => closeModal()}
                >
                    Cancel
                </button>
                <button
                    className="my-4 w-[270px] border-2 border-b-8 border-[#2D8F5C] bg-white py-4 font-workSans text-2xl font-black text-[#2D8F5C] hover:bg-[#FFB9B9] focus:outline-none"
                    onClick={() => delEvent(event.id)}
                >
                    Delete Event
                </button>
            </div>
        </div>
    )
}

export { DeletePizzaEventCard }
