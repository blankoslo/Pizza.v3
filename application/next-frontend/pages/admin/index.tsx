import { GetServerSideProps } from 'next'
import jwtDecode from 'jwt-decode'
import type { JwtToken } from '@/Admin/types/User'
import { Home } from 'Admin/scenarios/Home'
import { Navbar } from '@/Admin/scenarios/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const jwt = req.cookies['access_token_cookie']
    if (!jwt || !jwtDecode<JwtToken>(jwt)) return { redirect: { destination: '/login', permanent: false }, props: {} }

    return {
        props: {},
    }
}

const AdminHome = () => {
    return (
        <div>
            <Navbar />
            <Home />
        </div>
    )
}

export default AdminHome
