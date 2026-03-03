export type LoginRequest = {
    email: string,
    password: string,
}

export type LoginResponse = {
    email: string,
    success: boolean,
    code: number,
    message?: string,
}


export type RegisterRequest = {
    email: string,
    password: string,
}

export type RegisterResponse = {
    email: string,
    success: boolean,
    code: number,
    message?: string,
}
export type VerifyResponse = {
    isLoggedIn: boolean,
    email: string,
    success: boolean,
}

export type RefreshResponse = {refreshed: boolean}