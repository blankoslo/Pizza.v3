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
        setValue,
        formState: { errors },
    } = useForm({ resolver: zodResolver(validationSchema) })

    const { closeModal } = useModal()
    const { data, addRestaurant, delRestaurant } = useRestaurants()

    const validateForm = (data: Restaurant) => {
        const newRestaurant: Restaurant = { name: data.name }
        addRestaurant(newRestaurant)
        setValue('name', '')
    }

    return (
        <div className="relative w-[28rem] bg-yellow p-4">
            <div className="flex justify-between text-green-primary">
                <h5 className="mb-2 ml-6 pt-3 font-queensRegular text-3xl font-semibold">Places</h5>
                <span className="cursor-pointer text-4xl" onClick={() => closeModal()}>
                    &times;
                </span>
            </div>
            <div className="mx-auto flex w-[86%] justify-center border border-dashed border-green-primary" />
            <div className="ml-3 px-4 py-3 text-dark">
                <div className="mt-5 flex flex-col pb-6">
                    <div className="pl-4 italic text-green-primary">You have added...</div>
                    <h3 className="text-2xl font-semibold leading-10">
                        <span className={`px-4`}>{data?.length || 0} Pizza Places</span>
                    </h3>
                </div>

                <div className="flex flex-col justify-between">
                    <form
                        onSubmit={handleSubmit((data) => {
                            validateForm(data as Restaurant)
                        })}
                        className="flex flex-col px-6"
                    >
                        <input
                            className="mb-4 border border-gray-800 bg-white p-3 font-workSans italic hover:bg-green-secondary"
                            {...register('name')}
                            placeholder="Write your Pizza Places here"
                        />
                        {errors.name && <p></p>}
                    </form>

                    <div className="scrollable-wrapper mb-2 ">
                        <div className="scrollable-list h-[525px]">
                            {data &&
                                data.map((restaurant) => (
                                    <div
                                        className="flex cursor-pointer px-6 py-1 text-2xl hover:text-red"
                                        onClick={() => delRestaurant(restaurant.id)}
                                        key={restaurant.id}
                                    >
                                        <button>&times;</button>
                                        <p className="ml-2 font-workSans italic">{restaurant.name}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { NewRestaurantModal }
