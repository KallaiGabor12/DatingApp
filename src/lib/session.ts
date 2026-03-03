import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";
import { AttemptType } from "@prisma/client";

export interface SessionData {
  sessionId?: string;
}

export const sessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD || "change-this-to-a-secret-at-least-32-characters-long",
  cookieName: "iron-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

// Create a cookies wrapper for iron-session
function createCookiesWrapper(request: NextRequest, response: NextResponse) {
  return {
    get: (name: string) => {
      const cookie = request.cookies.get(name);
      if (!cookie) return undefined;
      return { name: cookie.name, value: cookie.value };
    },
    set: (name: string, value: string, options?: any) => {
      // Merge with session cookie options
      const cookieOptions = {
        ...sessionOptions.cookieOptions,
        ...(options || {}),
      };
      response.cookies.set(name, value, cookieOptions);
    },
  } as any;
}

export async function getSession(request: NextRequest, response: NextResponse) {
  const cookiesWrapper = createCookiesWrapper(request, response);
  const session = await getIronSession<SessionData>(cookiesWrapper, sessionOptions);
  
  // Generate session ID if it doesn't exist
  if (!session.sessionId) {
    session.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    await session.save();
  }
  
  // Always save to ensure cookie is persisted
  await session.save();
  
  return session;
}

export function copySessionCookie(from: NextResponse, to: NextResponse) {
  const sessionCookie = from.cookies.get(sessionOptions.cookieName);
  if (sessionCookie) {
    to.cookies.set(sessionCookie.name, sessionCookie.value, sessionOptions.cookieOptions);
  }
}

export function createResponseWithSession<T>(
  originalResponse: NextResponse,
  data: T,
  init?: ResponseInit
): NextResponse<T> {
  const newResponse = NextResponse.json<T>(data, init);
  
  // Copy all cookies from original response (including session cookie)
  originalResponse.cookies.getAll().forEach(cookie => {
    newResponse.cookies.set(cookie.name, cookie.value, {
      ...sessionOptions.cookieOptions,
      ...cookie,
    });
  });
  
  return newResponse;
}

export async function checkBan(
  sessionId: string,
  type: AttemptType
): Promise<{ isBanned: boolean; bannedUntil?: number }> {
  const now = Date.now();
  
  const attempt = await prisma.attempt.findFirst({
    where: {
      sessionID: sessionId,
      type: type,
    },
  });

  if (!attempt) {
    return { isBanned: false };
  }

  // Check if currently banned (convert from seconds to milliseconds for comparison)
  const bannedUntilMs = attempt.bannedUntil * 1000;
  if (bannedUntilMs > now) {
    return { isBanned: true, bannedUntil: bannedUntilMs };
  }

  return { isBanned: false };
}

export async function trackAttempt(
  sessionId: string,
  type: AttemptType,
  isInvalid: boolean
): Promise<{ isBanned: boolean; bannedUntil?: number }> {
  const now = Date.now();
  const nowSeconds = Math.floor(now / 1000); // Convert to seconds for database storage
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  // Find or create attempt record
  let attempt = await prisma.attempt.findFirst({
    where: {
      sessionID: sessionId,
      type: type,
    },
  });

  if (!attempt) {
    attempt = await prisma.attempt.create({
      data: {
        sessionID: sessionId,
        type: type,
        lastTry: nowSeconds,
        tries: isInvalid ? 1 : 0,
        bannedUntil: 0,
      },
    });
  }

  // Check if currently banned (convert from seconds to milliseconds for comparison)
  const bannedUntilMs = attempt.bannedUntil * 1000;
  if (bannedUntilMs > now) {
    return { isBanned: true, bannedUntil: bannedUntilMs };
  }

  // If not invalid, reset tries
  if (!isInvalid) {
    await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        tries: 0,
        lastTry: nowSeconds,
      },
    });
    return { isBanned: false };
  }

  // Check if last try was within 5 minutes (convert from seconds to milliseconds for comparison)
  const lastTryMs = attempt.lastTry * 1000;
  const recentAttempts = lastTryMs > fiveMinutesAgo;
  
  if (recentAttempts) {
    const newTries = attempt.tries + 1;
    
    // If exceeds 3 attempts, ban
    if (newTries > 3) {
      const banDuration = type === AttemptType.LOGIN ? 5 * 60 * 1000 : 10 * 60 * 1000; // 5 mins for login, 10 mins for reset
      const bannedUntilMs = now + banDuration;
      const bannedUntilSeconds = Math.floor(bannedUntilMs / 1000);
      
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: {
          tries: newTries,
          lastTry: nowSeconds,
          bannedUntil: bannedUntilSeconds,
        },
      });
      
      return { isBanned: true, bannedUntil: bannedUntilMs };
    } else {
      // Update tries
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: {
          tries: newTries,
          lastTry: nowSeconds,
        },
      });
    }
  } else {
    // Reset tries if last attempt was more than 5 minutes ago
    await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        tries: 1,
        lastTry: nowSeconds,
      },
    });
  }

  return { isBanned: false };
}

