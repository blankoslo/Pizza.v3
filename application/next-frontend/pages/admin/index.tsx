import { GetServerSideProps } from 'next'
import jwtDecode from 'jwt-decode'
import type { JwtToken, User } from '@/Admin/types/User'
import { Home } from 'Admin/scenarios/Home'

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

const AdminHome = ({ user }: { user: User }) => {
    return (
        <div>
            <h1>{user.name} logged in as admin</h1>
            <Home />
        </div>
    )
}

export default AdminHome
