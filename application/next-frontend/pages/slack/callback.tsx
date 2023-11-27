import { serversideApiUri } from '@/api/endpoints'
import { GetServerSideProps } from 'next'
import { SlackCallbackPageSuccess, SlackCallbackPageError } from 'Landing/scenarios/SlackCallbackPage'
import { Header } from '@/Landing/scenarios/Header'

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
        console.error(err)
    })

    const success = res?.ok
    let message: string | undefined
    try {
        message = (await res?.json()).message
    } catch (err) {
        console.error(err)
    }

    return { props: { success, message: message ?? null } }
}

const SlackInstallCallback = ({ success, message }: { success?: boolean; message: string | null }) => {
    return (
        <div className="relative h-screen overflow-hidden">
            <Header />
            {success ? (
                <SlackCallbackPageSuccess message={message ?? undefined} />
            ) : (
                <SlackCallbackPageError message={message ?? undefined} />
            )}
        </div>
    )
}

export default SlackInstallCallback
