import { Events } from 'Admin/scenarios/Events'
import { Restaurants } from 'Admin/scenarios/Restaurants'
import { SlackUsers } from 'Admin/scenarios/SlackUsers'
import AdminSidebar from 'Admin/components/AdminSidebar'

const Home = () => {
    return (
        <div className="flex h-screen">
            <div className="flex-1">
                <AdminSidebar />
            </div>
            <div className="grid-background flex-1">
                <div className="mt-20 flex flex-wrap justify-center gap-8">
                    <Restaurants />
                    <SlackUsers />
                    <Events />
                </div>
            </div>
        </div>
    )
}

export { Home }
