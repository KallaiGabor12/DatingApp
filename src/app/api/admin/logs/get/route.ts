import { jwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { Log, LogType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookie = request.cookies.get("access-token");
    if (!cookie || !(await jwt.verifyToken(cookie.value, "access"))) {
        return NextResponse.json({}, { status: 401 });
    }
    const {count} = await request.json() ?? 40;
    const records = await prisma.log.findMany({take: count}) ?? []
    const formatted: Omit<Log, "id">[] = []
    records.forEach(r => {
        formatted.push({
            message: r.message,
            type: r.type,
            date: r.date,
        })
    })
    return NextResponse.json({logs: formatted}, {status:200});
}