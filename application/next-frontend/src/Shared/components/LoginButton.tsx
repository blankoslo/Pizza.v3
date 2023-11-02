import { clientsideApiUri } from '@/api/endpoints'

const LoginButton = () => {
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
        <button
            className="flex w-fit flex-row items-center justify-center gap-4 border-2 border-solid border-black bg-gray-50 p-2 font-bold hover:bg-gray-200"
            onClick={loginRedirect}
        >
            <div className="flex h-8 items-center justify-center px-4">
                <span>Login</span>
            </div>
        </button>
    )
}

export { LoginButton }
