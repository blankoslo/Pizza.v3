import { Events } from 'Admin/scenarios/Events'
import { Restaurants } from 'Admin/scenarios/Restaurants'
import { SlackUsers } from 'Admin/scenarios/SlackUsers'

const Home = () => {
    return (
        <div className="mt-20 flex flex-wrap justify-center space-x-10 font-mono text-lg">
            <Restaurants />
            <SlackUsers />
            <Events />
        </div>
    )
}

export { Home }
