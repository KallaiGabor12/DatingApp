export type ResetRequestT = {
    email: string,
}

export type ResetResponseT = {
    code: number,
    message?: string,
}

export type TokenVerifyRequest = {
    token: string
}

export type TokenVerifyResponse = {
    code: number,
    isValid: boolean,
    message?: string
}

export type ResetPasswordRequest = {
    newpass: string,
    newpass2: string,
    token: string,
}

export type ResetPasswordResponse = {
    success: boolean,
    message?: string,
    code: number,
}