import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useModal } from 'Shared/context/ModalContext'
import { useRestaurants, Restaurant } from '@/api/useRestaurants'
import Button from 'Admin/components/Button'

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
        <div className="w-[25rem] bg-yellow p-4 shadow-2xl">
            <div className="m-10 flex justify-between">
                <h1 className="font-queensMedium text-5xl text-green-primary">New restaurant</h1>
            </div>

            <form onSubmit={handleSubmit((data) => validateForm(data as Restaurant))} className="flex flex-col px-6">
                <input
                    className="mb-4 border border-gray-800 bg-white p-3 font-workSans italic"
                    {...register('name')}
                    placeholder="Restaurant name*"
                />
                {errors.name && <p className=" font-workSans text-red-600"></p>}
                <input
                    className="mb-4 border border-gray-800 bg-white p-3 font-workSans italic"
                    {...register('link')}
                    placeholder="Restaurant link"
                />
                <input
                    className="mb-4 border border-gray-800 bg-white p-3 font-workSans italic"
                    {...register('tlf')}
                    placeholder="Restaurant phone number"
                />
                <input
                    className="mb-4 border border-gray-800 bg-white p-3 font-workSans italic"
                    {...register('address')}
                    placeholder="Restaurant address"
                />
                <Button
                    type="submit"
                    className="my-4 min-w-[7rem] text-xl hover:bg-green-secondary"
                    text="Add"
                    buttonStyle="primary"
                />
            </form>
        </div>
    )
}

export { NewRestaurantModal }
