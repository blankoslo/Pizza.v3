import EventCard from '../Events'
import RestaurantCard from 'Admin/scenarios/Restaurants'
import UserCard from '../Users'

const Home = () => {
    return (
        <div className="mt-20 flex flex-wrap justify-center space-x-10 font-mono text-lg">
            <RestaurantCard />
            <UserCard />
            <EventCard />
        </div>
    )
}

export default Home
