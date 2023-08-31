import { serversideApiUri } from '@/api/endpoints'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

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
    const router = useRouter()
    return (
        <div>
            <h1>An unknown error occured when logging in. </h1>
            <div>
                <h1>Error adding to workspace </h1>
                <button onClick={() => router.push('/login')}>Try again</button>
            </div>
        </div>
    )
}

export default LoginCallback
