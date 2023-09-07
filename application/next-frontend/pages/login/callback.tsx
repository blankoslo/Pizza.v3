import { serversideApiUri } from '@/api/endpoints'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
    const code = query.code
    if (!query.code || typeof query.code !== 'string')
        return { props: { errorMsg: 'Could not get login information from Slack.' } }

    const response = await fetch(`${serversideApiUri}/auth/login/callback?code=${code}`).catch((err) => {
        console.error(err)
    })

    if (!response?.ok) {
        return { props: { errorMsg: 'Something went wrong when logging inn through Slack.' } }
    }

    const cookie = response.headers.get('set-cookie')
    if (!cookie) return { props: { errorMsg: 'Login credentials were not set correctly.' } }

    res.setHeader('set-cookie', cookie)
    return { redirect: { destination: '/admin', permanent: false }, props: {} }
}

const LoginCallback = ({ errorMsg }: { errorMsg?: string }) => {
    return (
        <div className="flex w-full flex-col justify-center gap-8">
            <h1 className="text-center text-xl font-bold">Failed to log in!</h1>
            <h2 className="text-center font-bold">{`${errorMsg ?? ''} Try logging in again.`}</h2>
            <Link href={'/login'} className="m-auto w-fit border border-black px-8 py-2 hover:bg-slate-300">
                Go to login
            </Link>
        </div>
    )
}

export default LoginCallback
