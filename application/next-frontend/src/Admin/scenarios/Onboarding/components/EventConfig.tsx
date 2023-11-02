import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { TextField } from '@mui/material'
import { ApiEventPost, useEvents } from '@/api/useEvents'
import DatePicker from 'react-datepicker'
import { useRestaurants } from '@/api/useRestaurants'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import Button from '@/Admin/components/Button'

const EventConfig = () => {
    const router = useRouter()
    const validationSchema = z.object({
        dateTime: z.date().refine((value) => value !== null, { message: 'Date is required' }),
    })

    interface FormData {
        dateTime: Date
    }

    const { data: restaurantData } = useRestaurants()

    const findRestauarant = () => {
        if (restaurantData === undefined || restaurantData.length === 0) {
            return
        }

        const randomIndex = Math.floor(Math.random() * restaurantData.length)
        return restaurantData[randomIndex]
    }

    const today = new Date()

    const methods = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            dateTime: today,
        },
    })
    const { handleSubmit } = methods

    const { addEvent } = useEvents()

    const onSubmit = (data: FormData) => {
        const restaurant = findRestauarant()

        if (restaurant) {
            const event: ApiEventPost = {
                time: data.dateTime.toISOString(),
                people_per_event: 5,
                restaurant_id: restaurant.id,
            }
            addEvent(event)
        }
    }

    return (
        <div className="w-[25rem] bg-yellow p-4 shadow-2xl">
            <p className="font-queensMedium text-5xl text-green-primary">2/2</p>
            <h5 className="mb-2 px-6 py-3 font-workSans text-2xl font-semibold leading-tight text-dark">
                Set up your first event!
            </h5>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col font-workSans italic">
                    <div className="px-6">
                        <p>Date:</p>
                        <Controller
                            name="dateTime"
                            control={methods.control}
                            render={({ field }) => (
                                <DatePicker
                                    name={'date'}
                                    selected={field.value}
                                    className="mb-4 w-[300px] border border-gray-800 bg-white p-3"
                                    showTimeSelect
                                    onChange={(date: Date) => field.onChange(date)}
                                    customInput={<TextField />}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    required
                                    minDate={today}
                                />
                            )}
                        />
                        <p className="text-xs">*Invitations are sent out 10 days in advance*</p>
                        <div className="flex grow" />
                        <div className="my-4 flex place-content-evenly">
                            <Button
                                onClick={() => router.push('/admin')}
                                className="min-w-[7rem] text-lg"
                                text="Skip"
                                buttonStyle="primary"
                            />
                            <Button
                                type="submit"
                                onClick={() => router.push('/admin')}
                                className="min-w-[7rem] text-lg"
                                text="Create"
                                buttonStyle="primary"
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export { EventConfig }
