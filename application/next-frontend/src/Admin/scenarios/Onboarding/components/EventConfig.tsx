import { CardComponent } from 'Admin/components/CardComponent'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { TextField } from '@mui/material'
import { ApiEventPost, useEvents } from '@/api/useEvents'
import DatePicker from 'react-datepicker'
import { useRestaurants } from '@/api/useRestaurants'
import 'react-datepicker/dist/react-datepicker.css'

const EventConfig = () => {

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
        <CardComponent
            title="Add your first event"
            header={<p className="font-queensCTM text-5xl text-[#05793C]">2/2</p>}
        >
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col font-workSans italic">
                    <p className="text-[#05793C] ml-4">Date:</p>
                    <Controller
                        name="dateTime"
                        control={methods.control}
                        render={({ field }) => (
                            <DatePicker
                                name={'date'}
                                selected={field.value}
                                className='mb-4 p-3 w-full bg-white border border-gray-800'
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
                    <div className="flex space-x-4">
                    {/*
                        <button
                            className='my-4 min-w-[7rem] border-2 border-b-8 border-[#2D8F5C] bg-white px-4 py-2 font-workSans text-sm font-black italic text-[#2D8F5C] focus:outline-non hover:bg-[#5FE09D]'
                        >
                            Back
                        </button>
                        */}
                        <button
                            type="submit"
                            className='my-4 min-w-[7rem] border-2 border-b-8 border-[#2D8F5C] bg-white px-4 py-2 font-workSans text-sm font-black italic text-[#2D8F5C] focus:outline-non hover:bg-[#5FE09D]'
                            onClick={() => window.location.assign('/admin')}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </FormProvider>
            
        </CardComponent>
    )
}

export { EventConfig }
