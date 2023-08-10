import { Landing } from '@/Landing'
import { Header } from '@/Landing/scenarios/Header'

export default function Home() {
    return (
        <div className="h-full">
            <Header />
            <Landing />
        </div>
    )
}
