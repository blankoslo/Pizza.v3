import React from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { TextField } from '@mui/material'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from 'Admin/context/ModelContext'
import useEvents, { Event } from '@/api/useEvents'

const validationSchema = z.object({
    dateTime: z.date().refine((value) => value !== null, { message: 'Date is required' }),
    participants: z.number().int().min(1).positive('Number of participants must be greater than 0'),
})

interface FormData {
    dateTime: Date
    participants: number
}

const today = new Date()

const CreateEventCard = () => {
    const methods = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            dateTime: today,
            participants: 5,
        },
    })
    const { handleSubmit } = methods
    const { closeModal } = useModal()
    const { addEvent } = useEvents()

    const onSubmit = (data: FormData) => {
        const event: Event = {
            id: '1', // need a function to generate an ID
            date: data.dateTime.toISOString(),
            restaurantId: '2',
            peoplePerEvent: data.participants,
        }
        console.log(event)
        addEvent(event)
        closeModal()
    }

    return (
        <div className="relative">
            <button className="absolute right-2 top-2 text-gray-600 hover:text-gray-800" onClick={closeModal}>
                &times;
            </button>
            <h2>Legg til nytt pizzaarrangement!</h2>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <label>Dato</label>
                    <Controller
                        name="dateTime"
                        control={methods.control}
                        render={({ field }) => (
                            <DatePicker
                                name={'date'}
                                selected={field.value}
                                showTimeSelect
                                onChange={(date: Date) => field.onChange(date)}
                                customInput={<TextField />}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                required
                                minDate={today}
                            />
                        )}
                    />
                    <label>Number of Participants</label>
                    <Controller
                        name="participants"
                        control={methods.control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                inputProps={{ min: '1', step: '1' }}
                                required
                                label="Deltakere"
                                className="w-1/4"
                            />
                        )}
                    />
                    <button
                        type="submit"
                        className="w-1/4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        Add event
                    </button>
                </form>
            </FormProvider>
        </div>
    )
}

export { CreateEventCard }
