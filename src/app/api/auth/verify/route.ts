import { jwt } from '@/lib/jwt';
import log from '@/lib/log';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const refreshCookie = request.cookies.get("refresh-token");

    if (!refreshCookie) {
      return NextResponse.json({
        refreshed: false
      }, { status: 200 })
    }

    const rtoken = refreshCookie.value;
    const payload = await jwt.verifyToken(rtoken, "refresh");
    
    if(!payload){
      return NextResponse.json({
        refreshed: false
      }, { status: 200 })
    }
    const response = NextResponse.json({
      refreshed: true,
    }, {status:200})

    await jwt.createTokens(response, payload.email, payload.token_version)
    await log("LOG", "Tokens Verified for: " + payload.email);
    return response;

  } catch (error) {
    await log("ERROR", error as string);
    return NextResponse.json({
      refreshed: false
    }, { status: 500 })
  }
}
