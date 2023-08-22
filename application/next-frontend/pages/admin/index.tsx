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
    console.log(user) // fikk ikke lov til å committe uten å bruke user

    return (
        <div>
            <Home />
        </div>
    )
}

export default AdminHome
