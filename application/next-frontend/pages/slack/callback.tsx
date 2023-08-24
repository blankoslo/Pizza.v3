import { baseUrl } from '@/Admin/auth'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    if (!query.code || typeof query.code !== 'string')
        return { redirect: { destination: '/', permanent: false }, props: {} }

    return { props: { code: query.code } }
}

const SlackInstallCallback = ({ code }: { code: string }) => {
    const router = useRouter()

    useEffect(() => {
        const test = async () => {
            const res = await fetch(`${baseUrl}/slack/callback`, {
                method: 'POST',
                body: JSON.stringify({ code }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch((error) => {
                router.push('/landing')
            })
            if (!res?.ok) {
                return
            }
            router.push('/login')
        }
        if (code) test()
    }, [])

    if (!code) router.push('/landing')
    return (
        <div>
            <h1>Loading</h1>
        </div>
    )
}

export default SlackInstallCallback
