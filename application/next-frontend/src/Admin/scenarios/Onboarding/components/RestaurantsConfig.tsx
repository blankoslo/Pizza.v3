import Button from '@/Admin/components/Button'
import { Restaurant, useRestaurants } from '@/api/useRestaurants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface RestaurantsConfigProps {
    onNext: () => void
}

const RestaurantsConfig = (props: RestaurantsConfigProps) => {
    const { addRestaurant } = useRestaurants()
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])

    const validationSchema = z.object({
        name: z.string().min(1, { message: 'Name required' }),
    })

    const { register, handleSubmit, reset, getValues } = useForm<Restaurant>({
        resolver: zodResolver(validationSchema),
    })

    const validateForm = (data: Restaurant) => {
        setRestaurants((prevRestaurants) => [data, ...prevRestaurants])
        reset()
    }

    const addAllRestaurants = () => {
        if (restaurants.length !== 0) {
            restaurants.forEach(addRestaurant)
            setRestaurants([])
            props.onNext()
        }
    }

    const deleteRestaurant = (index: number) => {
        setRestaurants((prevRestaurants) => prevRestaurants.filter((_, i) => i !== index))
    }

    const handleAddClick = () => {
        const { name } = getValues()
        if (name) {
            validateForm({ name })
        }
    }

    return (
        <div className="w-[25rem] bg-yellow p-4 shadow-2xl">
            <p className="font-queensMedium text-5xl text-green-primary">1/2</p>
            <h5 className="mb-2 px-6 py-3 font-workSans text-2xl font-semibold leading-tight text-dark">
                What Pizza Places would you like to visit?
            </h5>
            <div className="flex flex-col justify-between">
                <form
                    onSubmit={handleSubmit((data: Restaurant) => {
                        validateForm(data)
                    })}
                    className="flex flex-col px-6"
                >
                    <input
                        className="mb-4 border border-gray-800 bg-white p-3 font-workSans italic"
                        {...register('name')}
                        placeholder="Write your Pizza Places here"
                    />
                </form>
                <div className="scrollable-wrapper mb-2 ">
                    <div className="scrollable-list h-[125px]">
                        {restaurants.map((restaurant, index) => (
                            <div className="flex px-6 text-2xl" key={index}>
                                <button onClick={() => deleteRestaurant(index)}>&times;</button>
                                <p className="ml-2 font-workSans italic">{restaurant.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button
                        onClick={handleAddClick}
                        className="my-4 min-w-[7rem] text-xl hover:bg-green-secondary"
                        text="Add"
                        buttonStyle="primary"
                    />
                    <Button
                        onClick={addAllRestaurants}
                        className={`my-4 min-w-[7rem] text-xl ${
                            restaurants.length === 0 ? 'cursor-default opacity-20' : 'hover:bg-green-secondary'
                        }`}
                        text="Continue"
                        buttonStyle="primary"
                    />
                </div>
            </div>
        </div>
    )
}

export { RestaurantsConfig }
