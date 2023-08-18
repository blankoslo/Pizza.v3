import { GetServerSideProps } from 'next'
import jwtDecode from 'jwt-decode'

interface Token {
    fresh: string
    iat: string
    jti: string
    type: string
    sub: string
    nbf: string
    exp: string
    user: {
        email: string
        picture: string
        id: string
        name: string
        roles: Array<string>
    }
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const jwt = req.cookies['access_token_cookie']
    if (!jwt) return { redirect: { destination: '/login', permanent: false }, props: {} }

    const decodedJWT = jwtDecode<Token>(jwt)
    return {
        props: {
            user: decodedJWT.user,
        },
    }
}

const AdminHome = ({ user }: { user: Token['user'] }) => {
    console.log(user)
    return (
        <div>
            <h1>Halooo</h1>
            {user.name}
        </div>
    )
}

export default AdminHome
