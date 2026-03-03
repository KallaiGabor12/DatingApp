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
  const {token} = await params;
  let isValidToken = false;
  let server_error: string | null = null;
  let isBanned = false;

  if (!token) {
    return <div>Token hiányzik</div>;
  }

  try {
    // Get session for attempt tracking
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    
    // Generate session ID if it doesn't exist
    if (!session.sessionId) {
      session.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      await session.save();
    }
    
    const sessionId = session.sessionId!;

    // Check if banned
    const banCheck = await checkBan(sessionId, AttemptType.RESET);
    if (banCheck.isBanned) {
      isBanned = true;
      server_error = "Túl sok sikertelen kísérlet. Kérjük, próbálja újra később.";
      return <PasswordResetStage 
        isValidToken={false}
        server_error={server_error}
        token={token}
        isBanned={isBanned}
      />;
    }

    // Call your database directly - no API route needed!
    const record = await prisma.passwordResetToken.findFirst({
      where: { token: token }
    });

    if (!record || record.dateCreated.getTime() < Date.now() - record.valid * 1000) {
      isValidToken = false;
      server_error = "Érvénytelen vagy lejárt token";
      // Track invalid attempt
      await trackAttempt(sessionId, AttemptType.RESET, true);
    } else {
      isValidToken = true;
      // Valid token - reset attempt counter
      await trackAttempt(sessionId, AttemptType.RESET, false);
    }
  } catch (err: any) {
    server_error = err?.message ?? "Unknown error";
  }

  return <PasswordResetStage 
    isValidToken={isValidToken}
    server_error={server_error}
    token={token}
    isBanned={isBanned}
    />;
}