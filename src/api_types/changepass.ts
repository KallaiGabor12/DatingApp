export type ChangePassRequestT = {
    oldpass: string,
    newpass: string,
    newpass2: string,
}

export type ChangePassResponseT = {
    success: Boolean,
    message?: String,
    code: Number,
}