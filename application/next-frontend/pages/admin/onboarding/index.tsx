import { GetServerSideProps } from 'next'
import { Onboarding as OnboardAdmin } from '@/Admin/scenarios/Onboarding'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const jwt = req.cookies['access_token_cookie']
    if (!jwt) return { redirect: { destination: '/login', permanent: false }, props: {} }

    /* This route is no longer used */
    return { redirect: { destination: '/admin', permanent: false }, props: {} }
}

const Onboarding = () => {
    return (
        <div>
            <OnboardAdmin />
        </div>
    )
}

export default Onboarding
