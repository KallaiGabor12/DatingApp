import { LoginResponse } from "@/api_types/login";
import { encryptEmail, getRecordByEmail, normalizeEmail, verifyPassword } from "@/lib/auth";
import { jwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession, trackAttempt, checkBan, createResponseWithSession } from "@/lib/session";
import { AttemptType } from "@prisma/client";
import log from "@/lib/log";

export async function POST(request: NextRequest) {
    try {
        let response = NextResponse.json<LoginResponse>({
            code: 200,
            message: "",
            success: false,
            email: "",
        }, { status: 200 });

        const session = await getSession(request, response);
        const sessionId = session.sessionId!;

        // Check if banned
        const banCheck = await checkBan(sessionId, AttemptType.LOGIN);
        if (banCheck.isBanned) {
            await log("WARN", "Failed login attempt through session");
            return createResponseWithSession<LoginResponse>(response, {
                code: 403,
                message: "Túl sok sikertelen bejelentkezési kísérlet. Kérjük, próbálja újra később.",
                success: false,
                email: "",
            }, { status: 200 });
        }

        let { email, password } = await request.json().then(v => v.data);
        email = normalizeEmail(email);
        let userRecord = await getRecordByEmail(email);

        if (!userRecord) {
            await trackAttempt(sessionId, AttemptType.LOGIN, true);
            await log("WARN", "Failed login attempt for: " + email);
            return createResponseWithSession<LoginResponse>(response, {
                code: 400,
                message: "Rossz felhasználónév vagy jelszó",
                success: false,
                email: "",
            }, { status: 200 });
        }


        const correctPassword = await verifyPassword(password, userRecord.password);
        if (!correctPassword) {
            await trackAttempt(sessionId, AttemptType.LOGIN, true);
            await log("WARN", "Failed login attempt for: " + email);
            return createResponseWithSession<LoginResponse>(response, {
                code: 400,
                message: "Rossz felhasználónév vagy jelszó",
                success: false,
                email: "",
            }, { status: 200 });
        }

        // Valid login - reset attempt counter
        await trackAttempt(sessionId, AttemptType.LOGIN, false);
        await log("LOG", "Successful login for: " + email);
        response = createResponseWithSession<LoginResponse>(response, {
            code: 200,
            message: "Sikeres bejelentkezés",
            success: true,
            email: email,
        }, { status: 200 });

        await jwt.createTokens(response, email, userRecord.token_version);
        return response;
    } catch (error) {
        await log("ERROR", error as string);
        // For error cases, we can't preserve session cookie since we don't have the original response
        return NextResponse.json<LoginResponse>({
            code: 500,
            message: "Belső szerverhiba",
            success: false,
            email: "",
        }, {status: 500})
    }


}