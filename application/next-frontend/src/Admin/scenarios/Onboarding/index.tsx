import { AdminSidebar } from 'Admin/components/AdminSidebar'
import { RestaurantsConfig } from './components/RestaurantsConfig'
import { EventConfig } from './components/EventConfig'
import { useState } from 'react'

const Onboarding = () => {
    const [step, setStep] = useState(0)

    return (
        <div className="flex h-screen">
            <div className="flex-1 bg-green-primary">
                <div className="mt-16">
                    <AdminSidebar />
                </div>
            </div>
            <div className="grid-background flex flex-1 items-center justify-center">
                {step === 0 ? <RestaurantsConfig onNext={() => setStep(1)} /> : <EventConfig />}
            </div>
        </div>
    )
}

export { Onboarding }
