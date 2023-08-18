export type User = {
    email: string
    picture: string
    id: string
    name: string
    roles: Array<string>
}

export type JwtToken = {
    fresh: string
    iat: string
    jti: string
    type: string
    sub: string
    nbf: string
    exp: string
    user: User
}
