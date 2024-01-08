import Button from '@/Admin/components/Button'
import { useModal } from 'Shared/context/ModalContext'
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
        <div className="flex w-[min(90wv,_50rem)] flex-col gap-8 rounded-[32px] border bg-green-light p-10">
            <div className="flex justify-between">
                <span className="font-queensRegular text-5xl text-green-primary">Delete Pizza Event?</span>
                <span
                    className="m-0 cursor-pointer text-4xl font-light text-green-quaternary"
                    onClick={() => closeModal()}
                >
                    &times;
                </span>
            </div>
            <div className="flex gap-8">
                <div className="flex flex-col font-workSans ">
                    <span className="text-2xl font-semibold italic text-green-primary">Date:</span>
                    <span className="text-3xl font-semibold">
                        {ordinal(date)} of {months[month]}
                    </span>
                </div>

                <div className="flex flex-col font-workSans">
                    <span className="text-2xl font-semibold italic text-green-primary">Time</span>
                    <span className="text-3xl font-semibold">{time}</span>
                </div>
            </div>

            <div className="my-4 flex justify-evenly">
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
