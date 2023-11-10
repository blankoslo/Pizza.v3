import { useModal } from 'Admin/context/ModelContext'
import { ApiEventPost, useEvents } from '@/api/useEvents'
import { useRestaurants } from '@/api/useRestaurants'

import { useForm, FormProvider, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/Admin/components/Button'

const formatTimeInput = (inp: string) => {
    const formatted = inp.replace(/[^\d]/g, '')

    return formatted.slice(0, 2)
}

const formatTimeInpOnBlur = (inp: string, min: number, max: number) => {
    let formatted = inp.replace(/[^\d]/g, '')
    if (formatted == '') formatted = '00'
    let timeNumber = parseInt(formatted)

    if (timeNumber < min) timeNumber = min
    else if (timeNumber > max) timeNumber = max

    if (timeNumber < 10) return `0${timeNumber}`
    return `${timeNumber}`
}

const validationSchema = z.object({
    eventDate: z.number(),
    eventMonth: z.number(),
    eventHour: z.string(),
    eventMinute: z.string(),
    participants: z.nullable(z.number().int()),
})

type FormData = {
    eventDate: number
    eventMonth: number
    eventHour: string
    eventMinute: string
    participants?: number
}

type Props = {
    selectedDate: Date
}

const CreatePizzaEventCard = ({ selectedDate }: Props) => {
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Date(0, i).toLocaleString('en-UK', { month: 'long' })
    })

    const date = selectedDate.getDate()
    const currentMonth = selectedDate.getMonth()
    const currentYear = selectedDate.getFullYear()

    const methods = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            eventDate: selectedDate.getDate(),
            eventMonth: selectedDate.getMonth(),
            eventHour: '18',
            eventMinute: '00',
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
        const newEventDate = new Date(
            currentYear,
            event.eventMonth,
            event.eventDate,
            parseInt(event.eventHour),
            parseInt(event.eventMinute),
        )

        console.log('Resturant', restaurant)
        console.log('newEvent', newEventDate)

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
        <div className="h-[448px] w-[703px] rounded-[32px] border bg-green-light px-14 py-10">
            <div className="flex justify-between">
                <span className="font-queensRegular text-5xl text-green-primary">Create Pizza Event?</span>
                <span
                    className="m-0 cursor-pointer text-4xl font-light text-green-quaternary"
                    onClick={() => closeModal()}
                >
                    &times;
                </span>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-14 flex font-workSans text-2xl font-semibold italic text-green-primary">
                        <span className="w-[63%] text-left">Date:</span>
                        <span className="w-[37%] text-left">Time</span>
                    </div>

                    <div className="mt-5 flex font-workSans text-4xl font-semibold ">
                        <span className="p-3 text-green-tertiary">{date}.</span>
                        <Controller
                            name="eventDate"
                            control={control}
                            defaultValue={date}
                            render={() => <input type="hidden" value={date} />}
                        />
                        <div className="ml-2 flex w-[17rem] justify-center p-3">
                            <span className="text-green-tertiary">{months[currentMonth]}</span>
                            <Controller
                                name="eventMonth"
                                control={control}
                                defaultValue={currentMonth}
                                render={({ field }) => (
                                    <input type="hidden" value={field.value} onChange={field.onChange} />
                                )}
                            />
                        </div>
                        {/* [&>*]:border-2 [&>*]:border-dotted [&>*]:border-[#94DBB6] */}
                        {/* <span className="ml-6 p-3 text-green-quaternary">{time}</span> */}
                        <div className="flex flex-row items-center gap-1">
                            <div className="w-fit border-2 border-dotted border-[#94DBB6]">
                                <Controller
                                    name="eventHour"
                                    control={control}
                                    defaultValue={'18'}
                                    render={({ field }) => (
                                        <input
                                            className="w-16 bg-transparent p-2 text-center hover:bg-green-secondary"
                                            type="text"
                                            onChange={(e) => {
                                                e.target.value = formatTimeInput(e.target.value)
                                                field.onChange(e)
                                            }}
                                            onBlur={(e) => {
                                                e.target.value = formatTimeInpOnBlur(e.target.value, 0, 23)
                                                field.onChange(e)
                                            }}
                                            value={field.value}
                                        />
                                    )}
                                />
                            </div>
                            <span className="text-green-quaternary">:</span>
                            <div className="w-fit border-2 border-dotted border-[#94DBB6]">
                                <Controller
                                    name="eventMinute"
                                    control={control}
                                    defaultValue={'00'}
                                    render={({ field }) => (
                                        <input
                                            className="w-16 bg-transparent p-2 text-center hover:bg-green-secondary"
                                            type="text"
                                            onChange={(e) => {
                                                e.target.value = formatTimeInput(e.target.value)
                                                field.onChange(e)
                                            }}
                                            onBlur={(e) => {
                                                e.target.value = formatTimeInpOnBlur(e.target.value, 0, 59)
                                                field.onChange(e)
                                            }}
                                            value={field.value}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="my-4 mt-14 flex justify-evenly">
                        <Button
                            onClick={() => closeModal()}
                            text="Cancel"
                            buttonStyle="secondary"
                            className="w-[270px]"
                        />
                        <Button text="Create Event" buttonStyle="primary" className="w-[270px]" type="submit" />
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export { CreatePizzaEventCard }
