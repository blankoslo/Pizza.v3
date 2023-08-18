import { baseUrl } from '@/Admin/auth'

const Login = () => {
    const login = async () => {
        const res = await fetch(baseUrl + '/auth/login', { method: 'GET' }).then((res) => res.json())
        const redirectURL = res.auth_url
        if (redirectURL) window.location.replace(redirectURL)
    }
    return (
        <div>
            <h1>Login Page </h1>
            <button onClick={login}>Login</button>
        </div>
    )
}

export default Login
