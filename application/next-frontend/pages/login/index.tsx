import { clientsideApiUri } from '@/api/endpoints'

const Login = () => {
    const login = async () => {
        const res = await fetch(clientsideApiUri + '/auth/login', { method: 'GET' }).then((res) => res.json())
        const redirectURL = res.auth_url
        if (redirectURL) window.location.replace(redirectURL)
    }
    return (
        <div className="flex w-full flex-col justify-center gap-8">
            <h1 className="text-center text-xl font-bold">Login Page </h1>
            <button className="m-auto w-fit border border-black px-8 py-2 hover:bg-slate-300" onClick={login}>
                Login
            </button>
        </div>
    )
}

export default Login
