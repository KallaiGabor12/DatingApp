import { getRecordByEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PasswordResetToken, User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import crypto from "crypto";
import * as nodemailer from "nodemailer";
import { sendMail } from '@/lib/mail';
import { pretty, render } from '@react-email/render';
import { RestorePasswordEmail } from '@/emails/Email';
import log from '@/lib/log';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Az email megadása kötelező.', code: 400 },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Helytelen email.', code: 400 },
      );
    }

    // Check if user exists
    let user = await getRecordByEmail(email);
    if (!user) {
      console.warn("==!!!== user not found");
      return NextResponse.json({
        message: 'Password reset email sent (if user exists)', code: 200
      });
    }
    // Check if reset token already exists
    let tokens = await prisma.passwordResetToken.findMany({
      where: {
        user: user,
      }
    });
    let now = Date.now();
    let validTokens: PasswordResetToken[] = tokens.filter((t) => {
      return t.dateCreated.getTime() > now - t.valid*1000
    })

    if (validTokens.length != 0) {
      return NextResponse.json({
        message: 'Már van egy érvényes email kiküldve.', code: 400
      });
    }
    await prisma.passwordResetToken.deleteMany({where: {user: user}});
    // Generate reset token
    const resetToken = crypto.randomBytes(64).toString("hex");
    await log("WARN", "Password Reset Token Generated for " + email);
    await sendMail(email, 'Jelszó helyreállítása', await render(RestorePasswordEmail({link: `${process.env.HOST}/reset-password/${resetToken}`}), {pretty:true}));
    await log("WARN", "Password Reset Token Sent for " + email);
    // Create new token row
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        user: { connect: user }
      }
    });

    return NextResponse.json({
      message: 'Password reset email sent (if user exists)', code: 200
    });
  } catch (error) {
    await log("ERROR",'Password reset error: ' + error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}