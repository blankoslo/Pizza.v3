import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useModal } from 'Admin/context/ModelContext'

import useRestaurants from '@/api/useRestaurants'
import { Restaurant } from '@/api/useRestaurants'

// interface Restaurant {
//     name: string
//     link?: string
//     address?: string
//     tlf?: string
//     id: string
// }

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
    const { updateRestaurants } = useRestaurants()

    const validateForm = (data: Restaurant) => {
        const newRestaurant: Restaurant = {
            name: data.name,
            id: '123', // change this to be dynamic!!
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
        console.log(newRestaurant)
        updateRestaurants(newRestaurant)
        closeModal()
    }

    return (
        <div className="bg-white">
            <div className="m-10 flex justify-between">
                <h1>New restaurant</h1>
                <button onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit((data) => validateForm(data as Restaurant))} className="flex flex-col">
                <input
                    className="mx-6 my-3 rounded-md p-3"
                    style={{ border: '1px solid lightgrey' }}
                    {...register('name')}
                    placeholder="Restaurant name*"
                />
                {errors.name && <p></p>}
                <input
                    className="mx-6 my-3 rounded-md p-3"
                    style={{ border: '1px solid lightgrey' }}
                    {...register('link')}
                    placeholder="Restaurant link"
                />
                <input
                    className="mx-6 my-3 rounded-md p-3"
                    style={{ border: '1px solid lightgrey' }}
                    {...register('tlf')}
                    placeholder="Restaurant phone number"
                />
                <input
                    className="mx-6 my-3 rounded-md p-3"
                    style={{ border: '1px solid lightgrey' }}
                    {...register('address')}
                    placeholder="Restaurant address"
                />
                <input className="cursor-pointer" type="submit" value="CREATE" />
            </form>
        </div>
    )
}

export { NewRestaurantModal }
