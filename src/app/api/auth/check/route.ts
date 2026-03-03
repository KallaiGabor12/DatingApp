import { VerifyResponse } from "@/api_types/login";
import { getRecordByEmail } from "@/lib/auth";
import { jwt } from "@/lib/jwt";
import log from "@/lib/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const refresh = request.cookies.get("refresh-token");
        if (refresh == undefined) {
            return NextResponse.json<VerifyResponse>({
                isLoggedIn: false,
                email: "",
                success: true
            }, { status: 200 })
        }

        const token = await jwt.verifyToken(refresh.value, "refresh");
        if(token == null){
            return NextResponse.json<VerifyResponse>({
            isLoggedIn: false,
            email: "",
            success: true
        }, { status: 200 })
        }

        return NextResponse.json<VerifyResponse>({
            isLoggedIn: true,
            email: token.email,
            success: true
        }, { status: 200 })

    }
    catch (error) {
        await log("ERROR", error as string);
        return NextResponse.json<VerifyResponse>({
            isLoggedIn: false,
            email: "",
            success: false
        }, { status: 500 })
    }
}