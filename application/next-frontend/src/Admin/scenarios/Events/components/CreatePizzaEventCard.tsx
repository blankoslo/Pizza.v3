import { useModal } from 'Admin/context/ModelContext'
import { ApiEventPost, useEvents } from '@/api/useEvents'
import { useRestaurants } from '@/api/useRestaurants'

import { useForm, FormProvider, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const validationSchema = z.object({
    eventDate: z.number(),
    eventMonth: z.number(),
    eventTime: z.string(),
    participants: z.nullable(z.number().int()),
})

type FormData = {
    eventDate: number
    eventMonth: number
    eventTime: string
    participants?: number
}

type Props = {
    selectedDate: Date
}

const CreatePizzaEventCard = ({ selectedDate }: Props) => {
    const [date, time] = [selectedDate.getDate(), '18:00']
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Date(0, i).toLocaleString('en-UK', { month: 'long' })
    })
    const currentMonth = selectedDate.getMonth()
    const currentYear = selectedDate.getFullYear()

    const methods = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            eventDate: selectedDate.getDate(),
            eventMonth: selectedDate.getMonth(),
            eventTime: '18:00',
            participants: 5,
        },
    })
    const { handleSubmit, control } = methods
    const { closeModal } = useModal()
    const { addEvent } = useEvents()
    const { data: restaurantData } = useRestaurants()

    const findRestaurant = () => {
        if (!restaurantData || !restaurantData.length) {
            return
        }

        const randomIndex = Math.floor(Math.random() * restaurantData.length)
        return restaurantData[randomIndex]
    }

    const onSubmit = (event: FormData) => {
        const restaurant = findRestaurant()
        const newEventDate = new Date(currentYear, event.eventMonth, event.eventDate, 18)

        if (restaurant) {
            const event: ApiEventPost = {
                time: newEventDate.toISOString(),
                restaurant_id: restaurant.id,
                people_per_event: 5,
            }
            addEvent(event)
            closeModal()
        }
    }

    return (
        <div className="h-[448px] w-[703px] rounded-[32px] border bg-[#EDFFF6] px-14 py-10">
            <div className="flex justify-between">
                <span className="font-queensRegular text-5xl text-[#05793C]">Create Pizza Event?</span>
                <span className="m-0 cursor-pointer text-4xl font-light text-[#004B24]" onClick={() => closeModal()}>
                    &times;
                </span>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-14 flex font-workSans text-2xl font-semibold italic text-[#05793C]">
                        <span className="w-[63%] text-left">Date:</span>
                        <span className="w-[37%] text-left">Time</span>
                    </div>

                    <div className="mt-5 flex font-workSans text-4xl font-semibold [&>*]:border-2 [&>*]:border-dotted [&>*]:border-[#94DBB6] ">
                        <span className="p-3 text-[#003F1E]">{date}.</span>
                        <Controller
                            name="eventDate"
                            control={control}
                            defaultValue={date}
                            render={() => <input type="hidden" value={date} />}
                        />

                        <div className="ml-2 flex w-[17rem] justify-center p-3">
                            <span className="text-[#003F1E]">{months[currentMonth]}</span>
                            <Controller
                                name="eventMonth"
                                control={control}
                                defaultValue={currentMonth}
                                render={({ field }) => (
                                    <input type="hidden" value={field.value} onChange={field.onChange} />
                                )}
                            />
                        </div>

                        <span className="ml-6 p-3 text-[#004B24]">{time}</span>
                        <Controller
                            name="eventTime"
                            control={control}
                            defaultValue={time}
                            render={() => <input type="hidden" value={time} />}
                        />
                    </div>

                    <div className="mt-14 flex justify-evenly">
                        <button
                            className="my-4 w-[270px] border-2 border-[#4E5445] py-4 font-workSans text-2xl font-semibold text-[#4E5445] hover:bg-[#FFF8C1] focus:outline-none"
                            type="button"
                            onClick={() => closeModal()}
                        >
                            Cancel
                        </button>
                        <button
                            className="my-4 w-[270px] border-2 border-b-8 border-[#2D8F5C] bg-white py-4 font-workSans text-2xl font-black text-[#2D8F5C] hover:bg-[#5FE09D] focus:outline-none"
                            type="submit"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export { CreatePizzaEventCard }
