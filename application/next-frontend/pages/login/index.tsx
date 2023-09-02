import { clientsideApiUri } from '@/api/endpoints'
import { useState } from 'react'

const Login = () => {
    const [errorMsg, setErrorMsg] = useState<string>()

    const loginRedirect = async () => {
        try {
            const res = await fetch(clientsideApiUri + '/auth/login')
            if (!res.ok) throw new Error()

            const redirectURL = (await res.json()).auth_url
            if (redirectURL) window.location.assign(redirectURL)
            else throw new Error()
        } catch (err) {
            setErrorMsg('Something went wrong when logging inn through Slack.')
        }
    }
    return (
        <div className="flex w-full flex-col justify-center gap-8">
            <h1 className="text-center text-xl font-bold">Login Page </h1>
            <button className="m-auto w-fit border border-black px-8 py-2 hover:bg-slate-300" onClick={loginRedirect}>
                Login
            </button>
            {errorMsg && <h2 className="text-center font-bold text-red-400">{`${errorMsg} Try logging in again.`}</h2>}
        </div>
    )
}

export default Login
