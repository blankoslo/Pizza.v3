import { GetServerSideProps } from 'next'
import jwtDecode from 'jwt-decode'
import type { JwtToken } from '@/Admin/types/User'
import { Onboarding as OnboardAdmin } from '@/Admin/scenarios/Onboarding'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const jwt = req.cookies['access_token_cookie']
    if (!jwt) return { redirect: { destination: '/login', permanent: false }, props: {} }

    const decodedJWT = jwtDecode<JwtToken>(jwt)

    return {
        props: {},
    }
}

const Onboarding = () => {
    return (
        <div>
            <OnboardAdmin />
        </div>
    )
}

export default Onboarding
