import { Restaurant, useRestaurants } from '@/api/useRestaurants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CardComponent } from 'Admin/components/CardComponent'

const RestaurantsConfig = (props: { onNext: () => void }) => {
    const { addRestaurant } = useRestaurants()
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])

    const validationSchema = z.object({
        name: z.string().min(1, { message: 'Name required' }),
    })

    const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(validationSchema) })

    const validateForm = (data: Restaurant) => {
        setRestaurants((prevRestaurants) => [data, ...prevRestaurants])
        reset()
    }

    const addAllRestaurants = () => {
        if (restaurants.length != 0) {
            restaurants.forEach(addRestaurant)
            setRestaurants([])
            props.onNext()
        }
    }

    const deleteRestaurant = (index: number) => {
        setRestaurants((prevRestaurants) => prevRestaurants.filter((_, i) => i !== index))
    }

    return (
        <CardComponent
            title="What pizza places would you like to visit?"
            header={<p className="font-queensCTM text-5xl text-[#05793C]">1/2</p>}
        >
            <div className="flex flex-col justify-between">
                <form
                    onSubmit={handleSubmit((data) => {
                        validateForm(data as Restaurant)
                    })}
                    className="flex flex-col"
                >
                    <input
                        className="mb-4 p-3 bg-white border border-gray-800 font-workSans italic"
                        {...register('name')}
                        placeholder="Write your Pizza Places here"
                    />
                </form>
                <div className="scrollable-wrapper mb-2">
                    <div className="scrollable-list h-[125px]">
                        {restaurants.map((restaurant, index) => (
                            <div className="flex text-2xl" key={index}>
                                <button onClick={() => deleteRestaurant(index)}>&times;</button>
                                <p className="ml-2 font-workSans italic">{restaurant.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        className={`my-4 min-w-[7rem] border-2 border-b-8 border-[#2D8F5C] bg-white px-4 py-2 font-workSans text-sm font-black italic text-[#2D8F5C] focus:outline-non ${
                            restaurants.length === 0 ? 'cursor-default opacity-20' : 'hover:bg-[#5FE09D]'
                        }`}
                        onClick={addAllRestaurants}
                    >
                        Next
                    </button>
                </div>
            </div>
        </CardComponent>
    )
}

export { RestaurantsConfig }
