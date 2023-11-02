import { GetServerSideProps } from 'next'
import jwtDecode from 'jwt-decode'
import type { JwtToken } from '@/Admin/types/User'
import { AdminMainPage } from '@/Admin/scenarios/AdminMainPage'
import { Navbar } from '@/Admin/scenarios/Navbar'
import { serversideApiUri } from '@/api/endpoints'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const jwt = req.cookies['access_token_cookie']
    if (!jwt || !jwtDecode<JwtToken>(jwt)) return { redirect: { destination: '/login', permanent: false }, props: {} }

    try {
        const resturantsRes = await fetch(`${serversideApiUri}/restaurants`, {
            headers: {
                cookie: req.headers.cookie,
            } as HeadersInit,
        })

        if (resturantsRes.status !== 200) return { redirect: { destination: '/login', permanent: false }, props: {} }
        const resturants = await resturantsRes.json()

        // If no resturants is set up, redirect to onboarding
        if (resturants.length === 0)
            return { redirect: { destination: '/admin/onboarding', permanent: false }, props: {} }
    } catch (error) {
        return { redirect: { destination: '/login', permanent: false }, props: {} }
    }

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
