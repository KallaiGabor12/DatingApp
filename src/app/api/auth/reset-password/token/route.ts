import { TokenVerifyRequest, TokenVerifyResponse } from "@/api_types/resetpass";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession, trackAttempt, checkBan, createResponseWithSession } from "@/lib/session";
import { AttemptType } from "@prisma/client";


export async function POST(request: NextRequest) {
    let response = NextResponse.json<TokenVerifyResponse>({
        code: 200,
        isValid: false,
        message: "",
    }, { status: 200 });

    const session = await getSession(request, response);
    const sessionId = session.sessionId!;

    // Check if banned
    const banCheck = await checkBan(sessionId, AttemptType.RESET);
    if (banCheck.isBanned) {
        return createResponseWithSession<TokenVerifyResponse>(response, {
            code: 403,
            isValid: false,
            message: "Túl sok sikertelen kísérlet. Kérjük, próbálja újra később.",
        }, { status: 200 });
    }

    const { token } = await request.json();

    if (!token) {
        await trackAttempt(sessionId, AttemptType.RESET, true);
        let resp: TokenVerifyResponse = {
            code: 400,
            isValid: false,
            message: "Hiányzó token."
        }
        return createResponseWithSession(response, resp, { status: 200 });
    }

    const record = await prisma.passwordResetToken.findFirst({ where: { token: token } });

        if (!record || record.dateCreated.getTime() < Date.now() - record.valid * 1000) {
        await trackAttempt(sessionId, AttemptType.RESET, true);
        let resp: TokenVerifyResponse = {
            code: 404,
            isValid: false,
            message: "Érvénytelen vagy lejárt token"
        }
        return createResponseWithSession(response, resp, { status: 200 });
    }

    // Valid token - reset attempt counter
    await trackAttempt(sessionId, AttemptType.RESET, false);

    let resp: TokenVerifyResponse = {
        code: 200,
        isValid: true,
        message: "Érvényes token."
    }
    return createResponseWithSession(response, resp, { status: 200 });
}