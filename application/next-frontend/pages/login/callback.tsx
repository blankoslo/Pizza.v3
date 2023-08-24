import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
    const code = query.code
    if (!query.code || typeof query.code !== 'string')
        return { redirect: { destination: '/login', permanent: false }, props: {} }

    const response = await fetch(`http://backend:3000/api/auth/login/callback?code=${code}`).catch((err) => {
        console.log(err)
        throw err
    })

    if (!response.ok) {
        return { redirect: { destination: '/login', permanent: false }, props: {} }
    }

    const cookie = response.headers.get('set-cookie')
    if (!cookie) return { redirect: { destination: '/login', permanent: false }, props: {} }

    res.setHeader('set-cookie', cookie)
    return { redirect: { destination: '/admin', permanent: false }, props: {} }
}

const LoginCallback = () => {
    return (
        <div>
            <h1>Loading</h1>
        </div>
    )
}

export default LoginCallback
