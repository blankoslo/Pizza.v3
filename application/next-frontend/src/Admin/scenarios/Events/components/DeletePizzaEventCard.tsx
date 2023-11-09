import Button from '@/Admin/components/Button'
import { useModal } from '@/context/ModelContext'
import { useEvents, ApiEvent } from '@/api/useEvents'
import ordinal from 'ordinal'

// Should pass ApiEvent instead and use those values

type Props = {
    event: ApiEvent
}

const DeletePizzaEventCard = ({ event }: Props) => {
    const [eventDate, eventId] = [new Date(event.time), event.id]
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Date(0, i).toLocaleString('en-UK', { month: 'long' })
    })
    const [date, month, time] = [
        eventDate.getDate(),
        eventDate.getMonth(),
        `${eventDate.getHours()}:${String(eventDate.getMinutes()).padStart(2, '0')}`,
    ]
    const { delEvent } = useEvents()
    const { closeModal } = useModal()

    return (
        <div className="h-[448px] w-[703px] rounded-[32px] border bg-green-light px-14 py-10">
            <div className="flex justify-between">
                <span className="font-queensRegular text-5xl text-green-primary">Delete Pizza Event?</span>
                <span
                    className="m-0 cursor-pointer text-4xl font-light text-green-quaternary"
                    onClick={() => closeModal()}
                >
                    &times;
                </span>
            </div>

            <div className="mt-14 flex font-workSans text-2xl font-semibold italic text-green-primary">
                <span className="w-[70%]">Date:</span>
                <span className="w-[30%]">Time</span>
            </div>

            <div className="mt-5 flex font-workSans text-3xl font-semibold">
                <span className="w-[70%]">
                    {ordinal(date)} of {months[month]}
                </span>
                <span className="w-[30%]">{time}</span>
            </div>

            <div className="my-4 mt-14 flex justify-evenly">
                <Button onClick={() => closeModal()} text="Cancel" buttonStyle="secondary" className="w-[270px]" />
                <Button
                    onClick={() => {
                        typeof eventId === 'string' ? delEvent(eventId) : ''
                        closeModal()
                    }}
                    className="w-[270px] hover:bg-red-light"
                    text="Delete Event"
                    buttonStyle="primary"
                />
            </div>
        </div>
    )
}

export { DeletePizzaEventCard }
