import { createHash, randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import type { PublicUser } from "../types.js";

export const SESSION_COOKIE = "waldo_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionToken(req: Request): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;

  const sessionCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));

  if (!sessionCookie) return undefined;

  const value = sessionCookie.slice(SESSION_COOKIE.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

export async function createSession(
  userId: number,
  res: Response
): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      id: randomUUID(),
      tokenHash: hashToken(token),
      userId,
      expiresAt,
    },
  });

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function findSessionUser(
  req: Request
): Promise<{ user: PublicUser; sessionId: string } | null> {
  const token = getSessionToken(req);
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  const { user } = session;
  return {
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    sessionId: session.id,
  };
}

export async function destroySession(req: Request): Promise<void> {
  const token = getSessionToken(req);
  if (!token) return;

  await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
