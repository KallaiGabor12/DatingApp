import { RegisterResponse } from '@/api_types/login';
import { createUser, getRecordByEmail, isValidEmail, isValidPassword, normalizeEmail } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { jwt } from '@/lib/jwt';
import log from '@/lib/log';

export async function POST(request: NextRequest) {
  try {
    if (process.env.ALLOW_REGISTER != "allow") {
      const cookie = request.cookies.get("access-token");
      if (!cookie || !(await jwt.verifyToken(cookie.value, "access"))) {
        return NextResponse.json({}, { status: 401 });
      }
    }
    let { email, password } = await request.json().then(v => v.data);

    if (!email || !password) {
      return NextResponse.json<RegisterResponse>({
        code: 400,
        message: "Hiányzó adatok",
        success: false,
        email: "",
      }, { status: 400 })
    }

    email = normalizeEmail(email);

    if (!isValidEmail(email)) {
      return NextResponse.json<RegisterResponse>({
        code: 400,
        message: "Hibás email",
        success: false,
        email: "",
      }, { status: 400 })
    }

    const record = await getRecordByEmail(email);

    if (record) {
      return NextResponse.json<RegisterResponse>({
        code: 409,
        message: "Felhasználónév foglalt",
        success: false,
        email: "",
      }, { status: 409 })
    }

    const newUser = await createUser({
      email: email,
      password: password
    })

    let response = NextResponse.json<RegisterResponse>({
      code: 200,
      message: "Sikeres regisztráció",
      success: true,
      email: email,
    }, { status: 200 })

    await jwt.createTokens(response, email, newUser.token_version);
    return response;

  } catch (error) {
    await log("ERROR", error as string);
    return NextResponse.json<RegisterResponse>({
      code: 500,
      message: "Belső szerverhiba",
      success: false,
      email: "",
    }, { status: 500 })
  }
}
