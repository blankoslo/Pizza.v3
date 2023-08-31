import { serversideApiUri } from '@/api/endpoints'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
    const code = query.code
    if (!query.code || typeof query.code !== 'string')
        return { redirect: { destination: '/login', permanent: false }, props: {} }

    const response = await fetch(`${serversideApiUri}/auth/login/callback?code=${code}`).catch((err) => {
        console.log(err)
    })

    if (!response?.ok) {
        return { redirect: { destination: '/login', permanent: false }, props: {} }
    }

    const cookie = response.headers.get('set-cookie')
    if (!cookie) return { redirect: { destination: '/login', permanent: false }, props: {} }

    res.setHeader('set-cookie', cookie)
    return { redirect: { destination: '/admin', permanent: false }, props: {} }
}

const LoginCallback = () => {
    return (
        <div className="flex w-full flex-col justify-center gap-8">
            <h1 className="text-center text-xl font-bold">Unknown error occured! </h1>
            <h2 className="text-center font-bold">Try logging in again </h2>
            <Link href={'/login'} className="m-auto w-fit border border-black px-8 py-2 hover:bg-slate-300">
                Go to login
            </Link>
        </div>
    )
}

export default LoginCallback
