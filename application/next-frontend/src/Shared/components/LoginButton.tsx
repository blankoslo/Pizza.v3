import { clientsideApiUri } from '@/api/endpoints'

const LoginButton = ({ className }: { className?: string }) => {
    const loginRedirect = async () => {
        try {
            const res = await fetch(clientsideApiUri + '/auth/login')
            if (!res.ok) throw new Error()

            const redirectURL = (await res.json()).auth_url
            if (redirectURL) window.location.assign(redirectURL)
            else throw new Error()
        } catch (err) {
            // TODO: Notify user of error
            console.error(err)
        }
    }

    return (
        <button className={`mx-12 ${className ?? ''}`} onClick={loginRedirect}>
            <span className="text-base font-black text-dark">Login</span>
        </button>
    )
}

export { LoginButton }
