import { Modal } from '@/Admin/components/Modal'
import { useModal } from '@/Admin/context/ModelContext'
import { Restaurant, useRestaurants } from '@/api/useRestaurants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ConfigurationModal = () => {
    const { openModal } = useModal()
    const [activeContent, setActiveContent] = useState(0)
    const [isInitialized, setIsInitialized] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { data: restaurants, addRestaurant } = useRestaurants()

    const validationSchema = z.object({
        name: z.string().min(1, { message: 'Name required' }),
    })

    const { register, handleSubmit } = useForm({ resolver: zodResolver(validationSchema) })

    const validateForm = (data: Restaurant) => {
        const newRestaurant: Restaurant = {
            name: data.name,
        }
        addRestaurant(newRestaurant)
        setActiveContent(1)
    }

    useEffect(() => {
        if (!isInitialized) {
            openModal()
            setIsInitialized(true)
        }
    }, [openModal, isInitialized])

    useEffect(() => {
        if (!restaurants || restaurants.length === 0) {
            setShowModal(true)
        } else {
            setShowModal(false)
        }
    }, [showModal])

    const eventContent = (
        <>
            <p className="mb-8 text-xl">Add an event!</p>
        </>
    )

    const restaurantContent = (
        <>
            <p className="mb-8 text-xl">Add a restaurant!</p>
            <form onSubmit={handleSubmit((data) => validateForm(data as Restaurant))} className="flex flex-col">
                <input
                    className="mx-6 my-3 rounded-md p-3"
                    style={{ border: '1px solid lightgrey' }}
                    {...register('name')}
                    placeholder="Restaurant name*"
                />
                <input className="cursor-pointer" type="submit" value="Add" />
            </form>
        </>
    )

    return (
        <>
            {showModal && (
                <Modal>
                    <div className="min-h-[400px] overflow-y-auto flex flex-col">
                        <div className="flex-grow">
                            <h1 className="mb-8 text-6xl font-bold text-neutral-800">Welcome to the Pizza family</h1>
                            {activeContent === 0 ? restaurantContent : eventContent}
                        </div>
                        <div className="mt-4 flex justify-center">
                            {[0, 1].map((index) => (
                                <div
                                    key={index}
                                    className={`mx-1 h-3 w-3 cursor-pointer rounded-full border-2 border-black ${
                                        activeContent === index ? 'bg-black' : ''
                                    }`}
                                    onClick={() => setActiveContent(index)}
                                />
                            ))}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

export { ConfigurationModal }
