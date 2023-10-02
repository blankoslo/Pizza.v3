// import { Events } from 'Admin/scenarios/Events'
// import { Restaurants } from 'Admin/scenarios/Restaurants'
// import { SlackUsers } from 'Admin/scenarios/SlackUsers'
// import { AdminSidebar } from 'Admin/components/AdminSidebar'

import { EventCalendar } from '../Events/components/EventCalendar'

const Home = () => {
    return (
        <EventCalendar />
        // <div className="flex h-screen">
        //     <div className="flex-1 bg-[#05793C]">
        //         <div className="mt-16">
        //             <AdminSidebar />
        //         </div>
        //     </div>
        //     <div className="grid-background flex-1">
        //         <div className="mt-16 flex flex-wrap justify-center gap-8">
        //             <Restaurants />
        //             <SlackUsers />
        //             <Events />
        //         </div>
        //     </div>
        // </div>
    )
}

export { Home }
