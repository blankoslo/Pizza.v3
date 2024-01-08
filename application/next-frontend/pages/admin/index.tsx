import { GetServerSideProps } from 'next'
import jwtDecode from 'jwt-decode'
import type { JwtToken } from '@/Admin/types/User'
import { AdminMainPage } from '@/Admin/scenarios/AdminMainPage'
import { Navbar } from '@/Admin/scenarios/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    /*  
    This only checks if attached cookie is a valid jwt, not that the session is valid
    Fetch requests made when admin page loads covers this, but a session-request
    to the backend would be needed here to avoid flicker of admin page on load. 
    */
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
