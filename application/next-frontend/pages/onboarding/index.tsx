import { GetServerSideProps } from 'next'
import jwtDecode from 'jwt-decode'
import type { JwtToken, User } from '@/Admin/types/User'
import { Navbar } from '@/Admin/scenarios/Navbar'
import { Onboarding as OnboardAdmin} from '@/Admin/scenarios/Onboarding'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const jwt = req.cookies['access_token_cookie']
    if (!jwt) return { redirect: { destination: '/login', permanent: false }, props: {} }

    const decodedJWT = jwtDecode<JwtToken>(jwt)
    return {
        props: {
            user: decodedJWT.user,
        },
    }
}

const Onboarding = ({ user }: { user: User }) => {
    return (
        <div>
            <Navbar user={user} />
            <OnboardAdmin/>
        </div>
    )
}

export default Onboarding
