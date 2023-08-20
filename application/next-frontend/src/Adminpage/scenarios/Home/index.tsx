import EventCard from './scenarios/Events'
import RestaurantCard from './scenarios/Restaurants'
import UserCard from './scenarios/Users'

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
