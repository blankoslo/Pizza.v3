import { Header } from '@/Landing/scenarios/Header'
import { LoginPage } from 'Landing/scenarios/LoginPage'

const Login = () => {
    return (
        <div className="relative flex min-h-screen flex-col overflow-auto">
            <Header />
            <LoginPage />
        </div>
    )
}

export default Login
