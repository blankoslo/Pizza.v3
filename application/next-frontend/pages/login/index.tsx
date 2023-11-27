import { Header } from '@/Landing/scenarios/Header'
import { LoginPage } from 'Landing/scenarios/LoginPage'

const Login = () => {
    return (
        <div className="relative h-screen overflow-hidden">
            <Header />
            <LoginPage />
        </div>
    )
}

export default Login
