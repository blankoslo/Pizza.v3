import { serversideApiUri } from '@/api/endpoints'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

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

    return { props: { success: res?.ok } }
}

const SlackInstallCallback = ({ success }: { success?: boolean }) => {
    if (!success) {
        return (
            <div className="flex w-full flex-col justify-center gap-8">
                <h1 className="text-center text-xl font-bold">Error adding to workspace </h1>
                <Link className="m-auto w-fit border border-black px-8 py-2 hover:bg-slate-300" href={'/'}>
                    Try again
                </Link>
            </div>
        )
    }

    return (
        <div className="flex w-full flex-col justify-center gap-8">
            <h1 className="text-center text-xl font-bold">Bot added to workspace! </h1>
            <h2 className="text-center font-bold">Login to administrate the bot </h2>
            <Link href={'/login'} className="m-auto w-fit border border-black px-8 py-2 hover:bg-slate-300">
                Go to login
            </Link>
        </div>
    )
}

export default SlackInstallCallback
