import { ChangePassRequestT, ChangePassResponseT } from '@/api_types/changepass';
import { decryptEmail, getRecordByEmail, hashPassword, verifyPassword } from '@/lib/auth';
import { jwt } from '@/lib/jwt';
import log from '@/lib/log';
import { sendMail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { PasswordChangedEmail } from '@/emails/Email';
import { render } from '@react-email/render';

export async function POST(request: NextRequest) {
    const data: ChangePassRequestT = await request.json();
    let responseData: ChangePassResponseT = {
        code: 400,
        success: false,
    };
    let response = NextResponse.json({ ...responseData }, {status: 200});
    
    const cookie = request.cookies.get("access-token");
    
    if(!cookie){
        responseData = {
            code: 401,
            success: false,
            message: "Nincs engedély.",
        }
        response = NextResponse.json({ ...responseData }, {status: 401});
        return response;
    }
    
    const token = await jwt.verifyToken(cookie.value, "access");

    if (!token) {
        responseData = {
            code: 401,
            success: false,
            message: "Nincs engedély.",
        }
        response = NextResponse.json({ ...responseData }, {status: 401});
        return response;
    }
    if (!data) {
        responseData = {
            code: 400,
            success: false,
            message: "Hiányzó adatok.",
        }
        response = NextResponse.json({ ...responseData }, {status: 200});
        return response;
    }

    if (data.newpass2 != data.newpass) {
        responseData = {
            code: 400,
            success: false,
            message: "Nem egyező mezők.",
        }
        response = NextResponse.json({ ...responseData }, {status: 200});
        return response;
    }

    if (!/\d/.test(data.newpass)) {
        responseData = {
            code: 400,
            success: false,
            message: "Hiányzó szám.",
        }
        response = NextResponse.json({ ...responseData }, {status: 200});
        return response;
    }

    if (!/[a-z]/.test(data.newpass)) {
        responseData = {
            code: 400,
            success: false,
            message: "Hiányzó kisbetű.",
        }
        response = NextResponse.json({ ...responseData }, {status: 200});
        return response;
    }

    if (!/[A-Z]/.test(data.newpass)) {
        responseData = {
            code: 400,
            success: false,
            message: "Hiányzó nagybetű.",
        }
        response = NextResponse.json({ ...responseData }, {status: 200});
        return response;
    }

    if (data.newpass.length < 7 || typeof (data.newpass) != "string") {
        responseData = {
            code: 400,
            success: false,
            message: "A jelszó túl rövid.",
        }
        response = NextResponse.json({ ...responseData }, {status: 200});
        return response;
    }

    let row = await getRecordByEmail(token.email);

    if (!row) {
        responseData = {
            code: 500,
            success: false,
            message: "Nem létező felhasználó.",
        }
        response = NextResponse.json({ ...responseData }, {status: 200});
        return response;
    }
    if(!await verifyPassword(data.oldpass,row.password)){
        responseData = {
            code: 405,
            success: false,
            message: "Helytelen régi jelszó.",
        }
        response = NextResponse.json({ ...responseData }, {status: 200});
        return response;
    }
    row.token_version = (row.token_version ?? 1) + 1;
    row.password = await hashPassword(data.newpass);

    try {
        await prisma.user.update({ where: { email: row.email }, data: { password: row.password, token_version: row.token_version } });
        await log("WARN", "Password changed for: (user ID) " + row.id);
        await sendMail(token.email, 'Jelszó változtatás', await render(PasswordChangedEmail({userid:row.id}), {pretty:true}))
    } catch (error) {
        await log("ERROR", error as string);
        responseData = {
            code: 500,
            success: false,
            message: "Belső szerverhiba.",
        }
        response = NextResponse.json({ ...responseData }, {status: 200});
        return response;
    }
    responseData = {
        code: 200,
        success: true,
    }
    return NextResponse.json({ ...responseData }, {status: 200})
}