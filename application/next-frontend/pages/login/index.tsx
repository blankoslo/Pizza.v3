import { LoginButton } from '@/Shared/components/LoginButton'

const Login = () => {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-8">
            <h1 className="text-center text-xl font-bold">Login Page </h1>

            <LoginButton />
        </div>
    )
}

export default Login
