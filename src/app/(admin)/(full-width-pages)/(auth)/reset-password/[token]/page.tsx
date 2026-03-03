import PasswordResetStage from "@/components/auth/PasswordResetStage";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions, checkBan, trackAttempt } from "@/lib/session";
import { AttemptType } from "@prisma/client";

export default async function ResetWithToken({
  params
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params;

  let isValidToken = false;
  let server_error: string | null = null;
  let isBanned = false;

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100">
        <div className="p-8 bg-white shadow-xl rounded-2xl text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Oops 💔</h1>
          <p className="text-gray-500">
            This reset link seems incomplete or missing.
          </p>
        </div>
      </div>
    );
  }

  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.sessionId) {
      session.sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      await session.save();
    }

    const sessionId = session.sessionId!;

    // Check if temporarily blocked
    const banCheck = await checkBan(sessionId, AttemptType.RESET);

    if (banCheck.isBanned) {
      isBanned = true;
      server_error =
        "Too many attempts 💔 Please wait a little before trying again.";
      
      return (
        <PasswordResetStage
          isValidToken={false}
          server_error={server_error}
          token={token}
          isBanned={isBanned}
        />
      );
    }

    const record = await prisma.passwordResetToken.findFirst({
      where: { token }
    });

    if (!record || record.dateCreated.getTime() < Date.now() - record.valid * 1000) {
      isValidToken = false;
      server_error =
        "This reset link has expired or is no longer valid 💌 Please request a new one.";
      
      await trackAttempt(sessionId, AttemptType.RESET, true);
    } else {
      isValidToken = true;
      await trackAttempt(sessionId, AttemptType.RESET, false);
    }

  } catch (err: any) {
    server_error =
      "Something unexpected happened. Please try again.";
  }

  return (
    <PasswordResetStage
      isValidToken={isValidToken}
      server_error={server_error}
      token={token}
      isBanned={isBanned}
    />
  );
}