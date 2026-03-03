import { ResetPasswordResponse } from "@/api_types/resetpass";
import { decryptEmail, hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession, trackAttempt, checkBan, createResponseWithSession } from "@/lib/session";
import { AttemptType } from "@prisma/client";
import log from "@/lib/log";
import { render } from "@react-email/render";
import { PasswordChangedEmail } from "@/emails/Email";


export async function POST(request: NextRequest) {
    let response = NextResponse.json<ResetPasswordResponse>({
        code: 200,
        success: false,
    }, { status: 200 });

    const session = await getSession(request, response);
    const sessionId = session.sessionId!;

    // Check if banned
    const banCheck = await checkBan(sessionId, AttemptType.RESET);
    if (banCheck.isBanned) {
        await log("WARN", "Failed password reset attempt through session.");
        return createResponseWithSession<ResetPasswordResponse>(response, {
            code: 403,
            success: false,
            message: "Túl sok sikertelen kísérlet. Kérjük, próbálja újra később.",
        }, { status: 200 });
    }

    const { newpass, newpass2, token } = await request.json();

    const tokenRecord = await prisma.passwordResetToken.findFirst({
        where: {
            token: token,
        }
    });

    let responseData: ResetPasswordResponse = {
        code: 200,
        success: false,
    }
    if (!newpass || !newpass2 || !token) {
        await log("WARN", "Failed password reset: missing data.");
        let responseData: ResetPasswordResponse = {
            code: 501,
            success: false,
            message: "Hiányzó adatok."
        }
        return createResponseWithSession(response, responseData, { status: 400 });
    }

    if (!tokenRecord || tokenRecord.dateCreated.getTime() < Date.now() - tokenRecord.valid * 1000) {
        await log("WARN", "Failed password reset: old token.");
        await trackAttempt(sessionId, AttemptType.RESET, true);
        let responseData: ResetPasswordResponse = {
            code: 502,
            success: false,
            message: "Helytelen vagy lejárt token."
        }
        return createResponseWithSession(response, responseData, { status: 200 });
    }

    if (newpass2 != newpass) {
        await log("WARN", "Failed password reset: mismatch.");
        let responseData: ResetPasswordResponse = {
            code: 400,
            success: false,
            message: "Nem egyező mezők."
        }
        return createResponseWithSession(response, responseData, { status: 200 });
    }

    //

    if (!/\d/.test(newpass)) {
        responseData = {
            code: 400,
            success: false,
            message: "Hiányzó szám.",
        }
        return createResponseWithSession(response, responseData, { status: 200 });
    }

    if (!/[a-z]/.test(newpass)) {
        responseData = {
            code: 400,
            success: false,
            message: "Hiányzó kisbetű.",
        }
        return createResponseWithSession(response, responseData, { status: 200 });
    }

    if (!/[A-Z]/.test(newpass)) {
        responseData = {
            code: 400,
            success: false,
            message: "Hiányzó nagybetű.",
        }
        return createResponseWithSession(response, responseData, { status: 200 });
    }

    if (newpass.length < 7 || typeof (newpass) != "string") {
        responseData = {
            code: 400,
            success: false,
            message: "A jelszó túl rövid.",
        }
        return createResponseWithSession(response, responseData, { status: 200 });
    }

    // All seems to be ok

    const usr = await prisma.user.findFirst({ where: { id: tokenRecord.userID } });

    if (!usr) {
        responseData = {
            code: 503,
            success: false,
            message: "A felhasználó már nem létezik.",
        }
        return createResponseWithSession(response, responseData, { status: 200 });
    }

    usr.token_version++;
    usr.password = await hashPassword(newpass);
    try {

        await prisma.user.update({ where: { id: usr.id }, data: usr });
        await prisma.passwordResetToken.deleteMany({ where: { userID: usr.id } });
        await log("LOG", "Successful password reset for: (user id) " + usr.id);
        await sendMail(decryptEmail(usr.email), 'Jelszó változtatás', await render(PasswordChangedEmail({userid:usr.id}), {pretty:true}))

        // Valid reset - reset attempt counter
        await trackAttempt(sessionId, AttemptType.RESET, false);

        responseData = {
            code: 200,
            success: true,
        }

        return createResponseWithSession(response, responseData, { status: 200 });
    } catch {
        await log("ERROR", "Password reset: failed to write to database.");
        responseData = {
            code: 500,
            success: false,
            message: "Hiba az adatbzisba írás során",
        }
        return createResponseWithSession(response, responseData, { status: 500 });
    }


}