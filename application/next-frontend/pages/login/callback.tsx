import { baseUrl } from '@/api/utils'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    if (!query.code || typeof query.code !== 'string')
        return { redirect: { destination: '/login', permanent: false }, props: {} }

    return { props: { code: query.code } }
}

const LoginCallback = ({ code }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter()

    useEffect(() => {
        if (code)
            fetch(`${baseUrl}/auth/login/callback?code=${code}`)
                .then(() => {
                    router.push('/admin')
                })
                .catch(() => {
                    router.push('/login')
                })
    }, [code, router])

    if (!code) router.push('/login')
    return (
        <div>
            <h1>Loading</h1>
        </div>
    )
}

export default LoginCallback
