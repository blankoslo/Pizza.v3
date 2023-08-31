import { serversideApiUri } from '@/api/endpoints'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const code = query.code
    if (!query.code || typeof query.code !== 'string') return { props: { success: false } }

    const res = await fetch(`${serversideApiUri}/slack/callback`, {
        method: 'POST',
        body: JSON.stringify({ code: code }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).catch((err) => {
        console.log(err)
        throw err
    })

    return { props: { success: res.ok } }
}

const SlackInstallCallback = ({ success }: { success: boolean }) => {
    const router = useRouter()
    if (!success) {
        return (
            <div>
                <h1>Error adding to workspace </h1>
                <button onClick={() => router.push('/')}>Try again</button>
            </div>
        )
    }

    return (
        <div>
            <h1>Bot added to workspace! </h1>
            <h2>Login to administrate the bot </h2>
            <button onClick={() => router.push('/login')}>Go to login</button>
        </div>
    )
}

export default SlackInstallCallback
