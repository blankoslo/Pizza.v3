import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useModal } from 'Admin/context/ModelContext'
import { useRestaurants, Restaurant } from '@/api/useRestaurants'
import Button from '@/Admin/components/Button'

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Name required' }),
    link: z.string().optional(),
    tlf: z.string().optional(),
    address: z.string().optional(),
})

const NewRestaurantModal = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(validationSchema) })

    const { closeModal } = useModal()
    const { addRestaurant } = useRestaurants()

    const validateForm = (data: Restaurant) => {
        const newRestaurant: Restaurant = {
            name: data.name,
        }
        if (data.link !== '') {
            newRestaurant.link = data.link
        }
        if (data.tlf !== '') {
            newRestaurant.tlf = data.tlf
        }
        if (data.address !== '') {
            newRestaurant.address = data.address
        }
        addRestaurant(newRestaurant)
        closeModal()
    }

    return (
        <div className="bg-yellow w-[25rem] p-4 shadow-2xl">
            <div className="m-10 flex justify-between">
                <h1 className="font-queensMedium text-green-primary text-5xl">New restaurant</h1>
            </div>

            <form onSubmit={handleSubmit((data) => validateForm(data as Restaurant))} className="flex flex-col px-6">
                <input
                    className="font-workSans mb-4 border border-gray-800 bg-white p-3 italic"
                    {...register('name')}
                    placeholder="Restaurant name*"
                />
                {/* Display the error message for the name field if there is one */}
                {errors.name && <p className="font-workSans text-red-600"></p>}
                <input
                    className="font-workSans mb-4 border border-gray-800 bg-white p-3 italic"
                    {...register('link')}
                    placeholder="Restaurant link"
                />
                <input
                    className="font-workSans mb-4 border border-gray-800 bg-white p-3 italic"
                    {...register('tlf')}
                    placeholder="Restaurant phone number"
                />
                <input
                    className="font-workSans mb-4 border border-gray-800 bg-white p-3 italic"
                    {...register('address')}
                    placeholder="Restaurant address"
                />
                <Button
                    type="submit"
                    className={"'hover:bg-green-secondary my-4 min-w-[7rem] text-xl"}
                    text="Add"
                    buttonStyle="primary"
                />
            </form>
        </div>
    )
}

export { NewRestaurantModal }
