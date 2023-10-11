import { GetServerSideProps } from 'next'
import jwtDecode from 'jwt-decode'
import type { JwtToken } from '@/Admin/types/User'
import { AdminMainPage } from '@/Admin/scenarios/AdminMainPage'
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
            <AdminMainPage />
        </div>
    )
}

export default AdminHome
