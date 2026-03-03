import { NextResponse } from "next/server";
import { sign, verify, decode } from "jsonwebtoken";
import ms from "ms";
import { decryptEmail, getRecordByEmail } from "./auth";
export type JWTPayload = {
    exp: number,
    token_version: number,
    email: string,
    type: "access" | "refresh"
}
export const jwt = {
    createTokens: async (response: NextResponse, email: string, token_version: number) => {
        let accessPayload: JWTPayload = {
            exp: Math.floor(Date.now() / 1000) + ms((process.env.ACCESS_TOKEN_EXPIRES_IN! as ms.StringValue)) / 1000,
            type: "access",
            email: email,
            token_version: token_version
        }
        let accessToken = sign(accessPayload, process.env.JWT_SECRET!)

        response.cookies.set("access-token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: ms(process.env.ACCESS_TOKEN_EXPIRES_IN! as ms.StringValue),
            path: '/',
        });

        let refreshPayload: JWTPayload = {
            exp: Math.floor(Date.now() / 1000) + ms((process.env.REFRESH_TOKEN_EXPIRES_IN! as ms.StringValue)) / 1000,
            type: "refresh",
            email: email,
            token_version: token_version
        }
        let refreshToken = sign(refreshPayload, process.env.JWT_REFRESH_SECRET!)

        response.cookies.set("refresh-token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN! as ms.StringValue),
            path: '/',
        });
    },
    verifyToken: async (token: string, type: "refresh" | "access") => {
        try {
            let verif = verify(token,
                type == "access" ? process.env.JWT_SECRET! :
                    type == "refresh" ? process.env.JWT_REFRESH_SECRET! : ""
            ) as JWTPayload

            const tokenVer = verif.token_version;
            const userRecord = await getRecordByEmail(verif.email);
            if (!userRecord) return null;
            if (userRecord.token_version != tokenVer || !userRecord.active) return null;

            return verif;
        } catch (error) {
            return null;
        }
    },
    getEmailFromToken: async (refreshToken: string) => {
        let verif = verify(refreshToken, process.env.JWT_REFRESH_SECRET!, { ignoreExpiration: true }
        ) as JWTPayload
        return verif.email ?? "expired token";
    }
}