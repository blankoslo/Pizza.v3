import { useRestaurants } from '@/api/useRestaurants'
import { Events } from 'Admin/scenarios/Events'
import { Restaurants } from 'Admin/scenarios/Restaurants'
import { SlackUsers } from 'Admin/scenarios/SlackUsers'
import { ConfigurationModal } from '../ConfigurationModal/ConfigurationModal'
import { ModalProvider, useModal } from 'Admin/context/ModelContext'
import { useState } from 'react'

const Home = () => {
    const { data, isLoading, error, delRestaurant } = useRestaurants()

    return (
        <div className="mt-20 flex flex-wrap justify-center gap-8 font-mono text-lg">
            <ModalProvider>
                <ConfigurationModal />
            </ModalProvider>

            <Restaurants />
            <SlackUsers />
            <Events />
        </div>
    )
}

export { Home }
